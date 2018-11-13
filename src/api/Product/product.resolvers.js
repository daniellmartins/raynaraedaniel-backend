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
      if ((data.name || data.name === "") && data.name.isEmpty()) {
        throw new Error("updateProduct name can not be null");
      }

      return await db.updateProduct({ data, where });
    }
  }
};
