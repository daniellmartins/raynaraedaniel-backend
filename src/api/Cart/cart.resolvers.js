export default {
  Query: {
    cart: async (_, args, { db, userId }) => {
      return await db.cart.find({ userId });
    }
  },
  Mutation: {
    addCart: async (
      _,
      { data: { quantity }, where: { productId } },
      { db, userId, pubSub }
    ) => {
      const cart = await db.cart.findOneAndUpdate(
        { userId, productId },
        { quantity },
        { new: true }
      );
      if (!cart) {
        await pubSub.publish("CART", {
          cart: { mutation: "CREATED", node: cart }
        });
        return await db.cart.create({ userId, productId, quantity });
      }

      await pubSub.publish("CART", {
        cart: { mutation: "UPDATED", node: cart }
      });
      return cart;
    }
  },
  Cart: {
    user: async (_, args, { db }) => {
      return await db.user.findById(_.userId);
    },
    product: async (_, args, { db }) => {
      return await db.product.findById(_.productId);
    }
  },
  Subscription: {
    cart: {
      subscribe: async (_, args, { pubSub }) => {
        return await pubSub.asyncIterator("CART");
      }
    }
  }
};
