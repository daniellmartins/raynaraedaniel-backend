export default {
  Query: {
    cart: async (_, args, { db, userId }) => {
      return await db.cart.find({ userId }).sort("createdAt");
    }
  },
  Mutation: {
    addCart: async (
      _,
      { data: { productId, quantity } },
      { db, userId, pubSub }
    ) => {
      let mutation = "UPDATED";
      let node = await db.cart.findOne({ userId, productId });

      if (!node) {
        mutation = "CREATED";
        node = await db.cart.create({ userId, productId, quantity });
      } else {
        const product = await db.product.findById(node.productId);

        if (!product || !node || (quantity > product.stock || quantity < 1)) {
          throw new Error("addCart error");
        }

        node = await db.cart.findByIdAndUpdate(
          node._id,
          { quantity },
          { new: true }
        );
      }

      await pubSub.publish("CART", {
        cart: { mutation, node }
      });
      return node;
    },
    removeCart: async (_, { data: { productId } }, { db, userId, pubSub }) => {
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
