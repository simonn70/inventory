import { Schema, model, models } from "mongoose";
import crypto from "crypto"; // Import crypto for generating unique IDs

const orderSchema = new Schema({
  orderId: {
    type: String,
    default: () => `ORD-${crypto.randomBytes(4).toString("hex").toUpperCase()}`, // Generate unique order ID
    unique: true,
  },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  warehouse: { type: String, enum: ["TEMA"] },
  products: [
    {
      productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
    },
  ],
  status: { type: String, enum: ["pending", "approved", "completed"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Order = models.Order || model("Orderr", orderSchema);
export default Order;
