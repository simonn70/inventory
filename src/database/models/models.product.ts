import { Schema, Types, model, models } from "mongoose";

const ProductSchema = new Schema({
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: false },
    storeId: { type: Types.ObjectId, ref: "Vendor", required: true }
}, { timestamps: true });

const Product = models.Product || model("Product", ProductSchema);
export default Product;
