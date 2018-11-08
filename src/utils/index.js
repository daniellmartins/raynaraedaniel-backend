import { verify } from "jsonwebtoken";

import { APP_SECRET } from "../config";

class AuthError extends Error {
  constructor() {
    super("Not authorized");
  }
}

export const getUserId = ctx => {
  const Authorization = ctx.request.get("Authorization");
  if (Authorization) {
    const token = Authorization.replace("Bearer ", "");
    const verifiedToken = verify(token, APP_SECRET);
    return verifiedToken && verifiedToken.userId;
  }
};
