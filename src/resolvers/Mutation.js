import { sign } from "jsonwebtoken";

import { APP_SECRET } from "../config";

export const Mutation = {
  signin: async (_, { code }, ctx) => {
    const user = await ctx.db.user({ code });
    if (!user) throw new Error(`No user found for code ${code}!`);
    return {
      token: sign({ userId: user.id }, APP_SECRET),
      user
    };
  }
};
