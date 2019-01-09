import "dotenv/config";

export const PORT = process.env.PORT;
export const APP_SECRET = process.env.APP_SECRET;
export const MONGO_DB = process.env.MONGO_DB;
export const DEBUG = process.env.DEBUG;
export const PLAYGROUND = process.env.PLAYGROUND
  ? process.env.PLAYGROUND
  : false;

export const PAGSEGURO_WS_API = process.env.PAGSEGURO_WS_API;
export const PAGSEGURO_AUTH_EMAIL = process.env.PAGSEGURO_AUTH_EMAIL;
export const PAGSEGURO_AUTH_TOKEN = process.env.PAGSEGURO_AUTH_TOKEN;
