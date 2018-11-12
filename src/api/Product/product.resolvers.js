export default {
  Query: {
    products: async (_, args, { db }, info) => {
      return await db.products({ where: { active: true } });
    }
  },
  Mutation: {
    createProduct: async (_, { data }, { db }, info) => {
      return await db.createProduct(data);
    },
    updateProduct: async (_, { data, where }, { db }, info) => {
      return await db.updateProduct({ data, where });
    }
  }
};
