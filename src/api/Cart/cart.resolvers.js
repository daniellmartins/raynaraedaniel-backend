import { withFilter } from "graphql-yoga";

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
        const product = await db.product.findById(node.productId);
        await pubSub.publish("PRODUCT", {
          product: { mutation: "UPDATED", node: product }
        });
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
        await pubSub.publish("PRODUCT", {
          product: { mutation: "UPDATED", node: product }
        });
      }

      await pubSub.publish("CART", {
        cart: { mutation, node }
      });
      return node;
    },
    removeCart: async (_, { data: { productId } }, { db, userId, pubSub }) => {
      const product = await db.product.findById(productId);
      const node = await db.cart.findOneAndDelete({ userId, productId });
      await pubSub.publish("CART", {
        cart: { mutation: "DELETED", node }
      });
      await pubSub.publish("PRODUCT", {
        product: { mutation: "UPDATED", node: product }
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
      subscribe: withFilter(
        (_, args, { pubSub }) => {
          return pubSub.asyncIterator("CART");
        },
        (_, args, { userId }) =>
          userId.toString() === _.cart.node.userId.toString()
      )
    }
  }
};
