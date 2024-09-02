"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    service: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Service'
    },
    productType: { type: String, enum: ['man', 'woman', 'kids', 'others'], required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String },
    available: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
const Product = mongoose_1.models.Product || (0, mongoose_1.model)("Product", productSchema);
exports.default = Product;
