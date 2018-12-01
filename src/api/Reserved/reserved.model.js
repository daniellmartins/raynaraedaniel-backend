import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ReservedSchema = Schema(
  {
    name: {
      type: String,
      required: true
    },
    tel: {
      type: String,
      required: true
    },
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

export default { reserved: mongoose.model("Reserved", ReservedSchema) };
