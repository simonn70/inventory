import { Schema, Types, model, models } from "mongoose";

const CustomerSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: false },
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true } 
    },
    phoneNumber: { type: String, required: true },
    verificationCode: { type: String, required: false },
    verified: { type: Boolean, required: false, default: false },
    orderId: [{ type: Types.ObjectId, ref: "Order", required: false }]
}, { timestamps: true })


CustomerSchema.index({ location: "2dsphere"})

const Customer = models.Customer || model("Customer", CustomerSchema)
export default Customer