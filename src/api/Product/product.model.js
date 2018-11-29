import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ProductSchema = Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: String,
    photoUrl: String,
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    },
    stock: {
      type: Number,
      required: true,
      default: 1
    },
    reserved: {
      type: Boolean,
      required: true,
      default: false
    },
    active: {
      type: Boolean,
      required: true,
      default: true
    }
  },
  { timestamps: true }
);

export default { product: mongoose.model("Product", ProductSchema) };
