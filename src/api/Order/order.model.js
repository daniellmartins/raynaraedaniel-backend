import mongoose from "mongoose";

const Schema = mongoose.Schema;

const OrderSchema = Schema(
  {
    senderName: {
      type: String,
      required: true
    },
    senderCPF: {
      type: String,
      require: true
    },
    senderAreaCode: {
      type: String,
      require: true
    },
    senderPhone: {
      type: String,
      require: true
    },
    senderEmail: {
      type: String,
      require: true
    },
    shippingAddressStreet: {
      type: String,
      require: true
    },
    shippingAddressNumber: {
      type: String,
      require: true
    },
    shippingAddressComplement: {
      type: String
    },
    shippingAddressDistrict: {
      type: String,
      require: true
    },
    shippingAddressPostalCode: {
      type: String,
      require: true
    },
    shippingAddressCity: {
      type: String,
      require: true
    },
    paymentMethod: {
      type: String,
      require: true
    },
    senderHash: {
      type: String,
      require: true
    }
  },
  { timestamps: true }
);

export default { order: mongoose.model("Order", OrderSchema) };
