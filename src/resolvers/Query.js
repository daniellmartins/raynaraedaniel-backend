const userId = "cjo529le0000k0b6804z0e46c";

const Query = {
  me: async (_, args, ctx, info) => {
    return await ctx.db.user({ id: userId });
  }
};

module.exports = { Query };
