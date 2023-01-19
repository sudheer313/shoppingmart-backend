const { model, Schema } = require("mongoose");
const orderSchema = new Schema(
  {
    purchased_items: { type: Object, required: true },
    shipping_details: { type: Object, required: true },
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    delivery_status: { type: String, default: "pending" },
    payment_status: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = model("Order", orderSchema);
