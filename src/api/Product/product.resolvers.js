function sortBy(orderBy) {
  const sortSplit = orderBy ? orderBy.split("_") : "";
  return sortSplit
    ? sortSplit[1] === "DESC"
      ? [sortSplit[0], -1]
      : [sortSplit[0], 1]
    : [];
}

export default {
  Query: {
    product: async (_, { where: { _id } }, { db }) => {
      return await db.product.findById(_id);
    },
    products: async (_, { orderBy }, { db }) => {
      let sort = [["quantity", 1]];
      if (orderBy) sort = [...sort, sortBy(orderBy), ["name", 1]];

      return await db.product.find({ active: true }).sort(sort);
    }
  },
  Mutation: {
    createProduct: async (_, { data }, { db, pubSub }) => {
      const product = await db.product.create({ ...data });
      await pubSub.publish("PRODUCT", {
        product: { mutation: "CREATED", node: product }
      });
      return product;
    },
    updateProduct: async (_, { data, where: { _id } }, { db, pubSub }) => {
      if ((data.name || data.name === "") && data.name.isEmpty()) {
        throw new Error("updateProduct name can not be null");
      }
      const product = await db.product.findByIdAndUpdate(
        _id,
        { ...data },
        { new: true }
      );
      if (!product) throw new Error("The product does not exist");
      await pubSub.publish("PRODUCT", {
        product: { mutation: "UPDATED", node: product }
      });
      return product;
    },
    deleteProduct: async (_, { where: { _id } }, { db, pubSub }) => {
      const product = await db.product.findByIdAndRemove(_id);
      if (!product) throw new Error("The product does not exist");
      await pubSub.publish("PRODUCT", {
        product: { mutation: "DELETED", node: product }
      });
      return product;
    }
  },
  Product: {
    cart: async (_, args, { db, userId }) => {
      return await db.cart.findOne({ userId, productId: _.id });
    }
    // cart: async (_, args, { db, userId, loaders }) => {
    //   // return await db.cart.findById(_.productId);
    //   return await loaders.cart.load(userId);
    // }
  },
  Subscription: {
    product: {
      subscribe: async (_, args, { pubSub }) => {
        return await pubSub.asyncIterator("PRODUCT");
      }
    }
  }
};
