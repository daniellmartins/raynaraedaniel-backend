export default {
  Query: {
    log: async (_, { where }, { db }) => {
      return await db.log.findById(where._id);
    },
    logs: async (_, args, { db }) => {
      return await db.log.find().sort({ createdAt: -1 });
    }
  },
  Log: {
    user: async (_, args, { db }) => {
      console.log(_);
      return await db.user.findById(_.userId);
    }
  }
};
