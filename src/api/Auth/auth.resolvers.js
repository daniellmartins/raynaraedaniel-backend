import { sign } from "jsonwebtoken";

import { APP_SECRET } from "../../config";

export default {
  Query: {
    me: async (_, args, { db, userId }, info) => {
      return await db.query.user({ where: { id: userId } }, info);
    }
  },
  Mutation: {
    signin: async (_, { code }, { db }, info) => {
      const user = await db.query.user({ where: { code } }, info);
      if (!user) throw new Error(`No user found for code "${code}"`);
      return {
        token: sign({ userId: user.id, role: user.role }, APP_SECRET),
        user
      };
    }
  }
};
