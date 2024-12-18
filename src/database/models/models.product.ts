import { Schema, model, models } from "mongoose";
import crypto from "crypto"; // Import crypto for generating unique IDs

const ProductSchema = new Schema({
  productId: {
    type: String,
    default: () => `PROD-${crypto.randomBytes(4).toString("hex").toUpperCase()}`, // Generate unique product ID
    unique: true,
  },
  name: { type: String},
  itemCode: { type: String, required: true },
  itemDescription: { type: String, required: true },
  project: { type: String, required: true },
  category: {
    type: String,
    enum: ["high_voltage", "low_voltage"], // Add categories here 
  },
  productType: {
    type: String,
  },
  warehouse: {
    type: String, 
  },
  quantity: { type: Number, default: 0 }, // Current stock
  reorderLevel: { type: Number, default: 0 }, // Minimum threshold for stock
  av_quantity: { type: Number, default: 0 }, // Available quantity
  variance: { type: Number, default: 0 },
  depreciation : { type: Number, default: 0 },
  bay: { type: String, default: '' }, // Bay location
  contents: { type: String, default: '' }, // Description of product contents
  totalCost: { type: Number, default: 0 }, // Total cost of products
  unitCost: { type: Number, default: 0 }, // Cost per unit
  totalTaken: { type: Number, default: 0 }, // Total quantity taken
  unit: { type: String,  }, // Unit of measurement
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Virtual field to compute status
ProductSchema.virtual("status").get(function () {
  return this.quantity > this.reorderLevel ? "inStock" : "lowStock";
});

const Product = models.Product || model("Product", ProductSchema);
export default Product;
