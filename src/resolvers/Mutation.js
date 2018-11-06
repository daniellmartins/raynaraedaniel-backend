const { sign } = require("jsonwebtoken");

const APP_SECRET = "my-secret-password-raynara-e-daniel";

const Mutation = {
  signin: async (_, { code }, ctx) => {
    const user = await ctx.db.user({ code });

    if (!user) {
      throw new Error(`No user found for code ${code}`);
    }

    return {
      token: sign({ userId: user.id }, APP_SECRET),
      user
    };
  }
};

module.exports = { Mutation };
