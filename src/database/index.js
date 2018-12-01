import mongoose from "mongoose";

import { DEBUG, MONGO_DB } from "../config";

mongoose.Promise = global.Promise;
mongoose.connect(
  MONGO_DB,
  { useNewUrlParser: true }
);
mongoose.set("useCreateIndex", true);
// mongoose.set("debug", DEBUG);

// bug graphql-js https://github.com/graphql/graphql-js/issues/1518
const { ObjectId } = mongoose.Types;
ObjectId.prototype.valueOf = function() {
  return this.toString();
};
