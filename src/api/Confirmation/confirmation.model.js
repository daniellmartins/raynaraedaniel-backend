import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ConfirmationSchema = Schema(
  {
    name: {
      type: String,
      required: true
    },
    confirmation: {
      type: String,
      required: true
    },
    adults: {
      type: Number,
      required: true,
      default: 1
    }
  },
  { timestamps: true }
);

export default {
  confirmation: mongoose.model("Confirmation", ConfirmationSchema)
};
