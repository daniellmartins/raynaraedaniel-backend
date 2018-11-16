import "dotenv/config";

export const PORT = process.env.PORT;
export const APP_SECRET = process.env.APP_SECRET;
export const MONGO_DB = process.env.MONGO_DB;
export const DEBUG = process.env.DEBUG;
export const PLAYGROUND = process.env.PLAYGROUND === "true" ? "/" : false;
