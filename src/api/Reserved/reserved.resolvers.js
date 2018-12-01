export default {
  Mutation: {
    addReserved: async (
      _,
      { data: { name, tel, productId, quantity } },
      { db, userId, pubSub }
    ) => {
      let product = await db.product.findById(productId);

      if (!product || (quantity > product.stock || quantity < 1)) {
        throw new Error("addReserved error");
      }

      const reserved = await db.reserved.findOneAndUpdate(
        { userId, productId },
        { name, tel, userId, productId, quantity },
        { upsert: true }
      );

      product.stock = product.stock - 1;
      product.save();

      let mutation_cart = "DELETED";
      let cart;
      if (product.stock <= 0) {
        cart = await db.cart.findOneAndDelete({ productId });
      } else {
        mutation_cart = "UPDATED";
        cart = await db.cart.findOne({ productId });
        if (cart) {
          cart.quantity = cart.quantity - 1;
          cart.save();
        }
      }

      if (cart) {
        await pubSub.publish("CART", {
          cart: { mutation: mutation_cart, node: cart }
        });
      }

      await pubSub.publish("PRODUCT", {
        product: { mutation: "UPDATED", node: product }
      });
      return reserved;
    },
    removeReserved: async (
      _,
      { data: { productId } },
      { db, userId, pubSub }
    ) => {
      const node = await db.reserved.findOneAndDelete({ userId, productId });
      await pubSub.publish("CART", {
        cart: { mutation: "DELETED", node }
      });
      return node;
    }
  },
  Reserved: {
    user: async (_, args, { db }) => {
      return await db.user.findById(_.userId);
    },
    product: async (_, args, { db, loaders }) => {
      return await loaders.product.load(_.productId);
    }
  }
};
