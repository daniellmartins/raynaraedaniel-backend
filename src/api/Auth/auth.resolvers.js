import { sign } from "jsonwebtoken";

import { APP_SECRET } from "../../config";

export default {
  Query: {
    me: async (_, args, { db, userId }) => {
      return await db.user.findById(userId);
    }
  },
  Mutation: {
    signin: async (_, { code }, { db }) => {
      const user = await db.user.findOne({ code });
      if (!user) throw new Error(`No user found for code '${code}'`);
      return {
        token: sign({ userId: user.id, role: user.role }, APP_SECRET),
        user
      };
    },
    signup: async (_, { data }, { db }) => {
      const user = await db.user.create({ ...data });
      return {
        token: sign({ userId: user.id, role: user.role }, APP_SECRET),
        user
      };
    }
  }
};
