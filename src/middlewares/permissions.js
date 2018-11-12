import { verify } from "jsonwebtoken";

import { APP_SECRET } from "../config";

const isAuthenticated = async (_, args, ctx, info) => {
  let authorized;
  if (info.operation.operation === "subscription") {
    authorized = await ctx.connection.context.Authorization;
  } else {
    authorized = await ctx.request.get("Authorization");
  }

  if (!authorized) throw new Error("Not authorized");

  const token = authorized.replace("Bearer ", "");
  const verifiedToken = verify(token, APP_SECRET);
  if (!verifiedToken && !verifiedToken.userId)
    throw new Error("Token is invalid");

  ctx.userId = verifiedToken.userId;
  ctx.role = verifiedToken.role;
  return true;
};

const isUser = async (resolve, _, args, ctx, info) => {
  await isAuthenticated(_, args, ctx, info);
  return resolve();
};

const isAdmin = async (resolve, _, args, ctx, info) => {
  await isAuthenticated(_, args, ctx, info);
  if (ctx.role !== "ADMIN")
    throw new Error("User does not have administrative permissions");
  return resolve();
};

export const permissions = {
  Query: {
    me: isUser,
    products: isUser
  },
  Mutation: {
    createProduct: isAdmin
  }
};
