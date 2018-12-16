export default {
  Mutation: {
    createConfirmation: async (_, { data }, { db }) => {
      return await db.confirmation.create({ ...data });
    }
  }
};
