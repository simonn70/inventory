import { Schema, Types, model, models } from "mongoose";

const OrderSchema = new Schema({
    vendorId: { type: Types.ObjectId, ref: "Vendor"},
    customerId: { type: Types.ObjectId, ref: "Customer" },
    services: [{ type: Schema.Types.ObjectId, ref: 'Product', required: true }],
    deliveryGuy: { type: Types.ObjectId, ref: "DeliveryGuy"},
    invoice: { type: String, required: false },
    status: { type: String, required: false },
}, { timestamps: true } )

const Order = models.Order || model("Order", OrderSchema)
export default Order