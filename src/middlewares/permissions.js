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

  const user = await ctx.db.user.findById(verifiedToken.userId);
  if (!user) throw new Error("No user found");

  ctx.userId = user._id;
  ctx.role = user.role;
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
    cart: isUser,
    me: isUser,
    products: isUser
  },
  Mutation: {
    addCart: isUser,
    addReserved: isUser,
    createProduct: isAdmin,
    deleteProduct: isAdmin,
    removeCart: isUser,
    removeReserved: isAdmin,
    signup: isAdmin,
    updateProduct: isAdmin
  },
  Subscription: {
    cart: isUser,
    product: isUser
  }
};
