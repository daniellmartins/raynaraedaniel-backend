import mongoose from "mongoose";

const Schema = mongoose.Schema;

const LogSchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true
    }
  },
  { timestamps: true }
);

export default { log: mongoose.model("Log", LogSchema) };
