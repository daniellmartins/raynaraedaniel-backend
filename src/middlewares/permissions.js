import { verify } from "jsonwebtoken";

import { APP_SECRET } from "../config";

const isAuthenticated = async (resolve, _, args, ctx, info) => {
  const authorized = ctx.request.get("Authorization");
  if (!authorized) throw new Error("Not authorized");

  const token = authorized.replace("Bearer ", "");
  const verifiedToken = verify(token, APP_SECRET);
  if (!verifiedToken && !verifiedToken.userId)
    throw new Error("Token is invalid");

  ctx.userId = verifiedToken.userId;
  return resolve();
};

export const permissions = {
  Query: {
    me: isAuthenticated
  }
};
