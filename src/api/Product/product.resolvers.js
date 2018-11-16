export default {
  Query: {
    product: async (_, args, { db, where }, info) => {
      return await db.query.product({ where }, info);
    },
    products: async (_, { orderBy }, { db }, info) => {
      return await db.query.products(
        {
          where: { active: true },
          orderBy
        },
        info
      );
    }
  },
  Mutation: {
    createProduct: async (_, { data }, { db }, info) => {
      return await db.mutation.createProduct({ data });
    },
    updateProduct: async (_, { data, where }, { db }, info) => {
      if ((data.name || data.name === "") && data.name.isEmpty()) {
        throw new Error("updateProduct name can not be null");
      }

      return await db.mutation.updateProduct({ data, where }, info);
    },
    deleteProduct: async (_, { where }, { db }, info) => {
      return await db.mutation.deleteProduct({ where }, info);
    }
  },
  Subscription: {
    product: {
      subscribe: (_, args, { db }, info) => {
        return db.subscription.product({}, info);
      }
    }
  }
};
