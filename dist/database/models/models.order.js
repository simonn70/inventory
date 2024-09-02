"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    customer: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    partner: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    products: [{
            product: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true }
        }],
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid', 'failed'],
        default: 'unpaid'
    },
    // payment: { type: Schema.Types.ObjectId, ref: 'Payment' },
    location: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Location' },
    deliveryTime: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
const Order = mongoose_1.models.Order || (0, mongoose_1.model)("Order", orderSchema);
exports.default = Order;
