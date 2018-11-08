import { sign } from "jsonwebtoken";

import { APP_SECRET } from "../../config";

export default {
  Query: {
    me: async (_, args, { db, userId }) => {
      return await db.user({ id: userId });
    }
  },
  Mutation: {
    signin: async (_, { code }, ctx) => {
      const user = await ctx.db.user({ code });
      if (!user) throw new Error(`No user found for the code "${code}"`);
      return {
        token: sign({ userId: user.id }, APP_SECRET),
        user
      };
    }
  }
};
