import { Schema, Types, model, models } from "mongoose";

const CustomerSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: false },
    location: { type: String, required: false },
    phoneNumber: { type: String, required: true },
    orderId: [{ type: Types.ObjectId, ref: "Order", required: false }]
}, { timestamps: true })


const Customer = models.Customer || model("Customer", CustomerSchema)
export default Customer