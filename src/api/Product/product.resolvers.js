export default {
  Query: {
    product: async (_, { where: { _id } }, { db }) => {
      return await db.product.findById(_id);
    },
    products: async (_, { orderBy }, { db }) => {
      return await db.product.find({ active: true }).sort(orderBy);
    }
  },
  Mutation: {
    createProduct: async (_, { data }, { db }) => {
      return await db.product.create({ data });
    },
    updateProduct: async (_, { data, where: { _id } }, { db }) => {
      if ((data.name || data.name === "") && data.name.isEmpty()) {
        throw new Error("updateProduct name can not be null");
      }

      return await db.product.findByIdAndUpdate(_id, { data }, { new: true });
    },
    deleteProduct: async (_, { where: { _id } }, { db }) => {
      return await db.mutation.findByIdAndRemove(_id);
    }
  }
  // Subscription: {
  //   product: {
  //     subscribe: (_, args, { db }, info) => {
  //       return db.subscription.product({}, info);
  //     }
  //   }
  // }
};
