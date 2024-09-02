import { Schema, Types, model, models } from "mongoose";

const productSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    service: {
        type: Schema.Types.ObjectId,
        ref: 'Service'
    },
    productType: { type: String, enum: ['man', 'woman', 'kids', 'others'], required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String },
    available: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
const Product = models.Product || model("Product", productSchema);
export default Product;
