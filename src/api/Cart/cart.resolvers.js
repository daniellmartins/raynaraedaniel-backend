export default {
  Query: {
    cart: async (_, args, { db, userId }) => {
      return await db.cart.find({ userId }).sort("createdAt");
    }
  },
  Mutation: {
    addCart: async (
      _,
      { data: { quantity }, where: { productId } },
      { db, userId, pubSub }
    ) => {
      let mutation = "UPDATED";
      let node = await db.cart.findOneAndUpdate(
        { userId, productId },
        { quantity },
        { new: true }
      );

      if (!node) {
        mutation = "CREATED";
        node = await db.cart.create({ userId, productId, quantity });
      }

      await pubSub.publish("CART", {
        cart: { mutation, node }
      });
      return node;
    },
    removeCart: async (_, { where: { productId } }, { db, userId, pubSub }) => {
      const node = await db.cart.findOneAndDelete({ userId, productId });
      await pubSub.publish("CART", {
        cart: { mutation: "DELETED", node }
      });
      return node;
    }
  },
  Cart: {
    user: async (_, args, { db }) => {
      return await db.user.findById(_.userId);
    },
    product: async (_, args, { db, loaders }) => {
      // return await db.product.findById(_.productId);
      return await loaders.product.load(_.productId);
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
