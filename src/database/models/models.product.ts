import { Schema, model, models } from "mongoose";
import crypto from "crypto"; // Import crypto for generating unique IDs

const ProductSchema = new Schema({
  productId: {
      type: String,
      default: () => `PROD-${crypto.randomBytes(4).toString("hex").toUpperCase()}`, // Generate unique order ID
      unique: true,
    },
  name: { type: String, required: true },
  itemCode: { type: String, required: true },
  itemDescription: { type: String, required: true },
  project: { type: String, required: true },
  category: {
    type: String,
    enum: ["high_voltage", "low_voltage"], // Add your categories here
    required: true,
  },
  itemType: {
    type: String,
    enum: ["cables", "Switchgear", "plugs", "cones", "SF6-GS", "accessory", "control", "supply", "protection"], // Add your categories here
    required: true,
  },
  warehouse: {
    type: String,
    enum: ["TEMA", "WAREHOUSE_A"], // Add your categories here
    required: true,
  },
  quantity: { type: Number, default: 0 }, // Current stock
  reorderLevel: { type: Number, default: 10 }, // Minimum threshold
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Virtual field to compute status
ProductSchema.virtual("status").get(function () {
  return this.quantity > this.reorderLevel ? "inStock" : "lowStock";
});

const Product = models.Product || model("Product", ProductSchema);
export default Product;
