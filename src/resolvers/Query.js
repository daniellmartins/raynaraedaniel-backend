export const Query = {
  me: async (_, args, { db, userId }) => {
    return await db.user({ id: userId });
  }
};
