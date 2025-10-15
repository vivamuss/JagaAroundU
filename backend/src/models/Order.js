const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },

    dealId: { type: String, required: true },
    dealTitle: { type: String, required: true },
    dealDescription: { type: String },

    originalPrice: { type: Number, required: true },
    discountPrice: { type: Number, required: true },

    category: { type: String, default: "food" },
    specialInstructions: { type: String, default: "" },
    quantity: { type: Number, default: 1 },

    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
