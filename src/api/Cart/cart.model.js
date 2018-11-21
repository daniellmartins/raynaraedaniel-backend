import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CartSchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    productId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    }
  },
  { timestamps: true }
);

export default { cart: mongoose.model("Cart", CartSchema) };
