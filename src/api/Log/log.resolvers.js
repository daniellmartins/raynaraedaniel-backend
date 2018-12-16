export default {
  Query: {
    log: async (_, { where }, { db }) => {
      return await db.log.findById(where._id);
    },
    logs: async (
      _,
      { limit = 50, offset = 0, orderBy = { createdAt: -1 } },
      { db }
    ) => {
      return await db.log
        .find()
        .skip(offset)
        .limit(limit)
        .sort(orderBy);
    }
  },
  Log: {
    user: async (_, args, { db }) => {
      return await db.user.findById(_.userId);
    }
  }
};
