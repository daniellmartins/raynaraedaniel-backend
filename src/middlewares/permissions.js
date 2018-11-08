import { rule, shield } from "graphql-shield";

import { getUserId } from "../utils";

const rules = {
  isAuthenticated: rule()(async (_, args, ctx, info) => {
    const userId = getUserId(ctx, info);
    ctx.userId = userId;
    return !!userId;
  })
};

export const permissions = shield({
  Query: {
    me: rules.isAuthenticated
  }
});
