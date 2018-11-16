import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ProductSchema = Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: String,
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    },
    photoUrl: String,
    active: {
      type: Boolean,
      required: true,
      default: true
    }
  },
  { timestamps: true }
);

export default { product: mongoose.model("Product", ProductSchema) };
