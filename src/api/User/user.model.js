import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = Schema(
  {
    code: {
      type: Number,
      unique: true,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true,
      default: "USER"
    }
  },
  { timestamps: true }
);

export default { user: mongoose.model("User", UserSchema) };
