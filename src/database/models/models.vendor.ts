import { Schema, Types, model, models } from "mongoose";
const VendorSchema = new Schema({
    storeName: { type: String, required: true },
    category: [String],
    phoneNumber: { type: String, required: true },
    storeEmail: { type: String, required: true },
    password: { type: String, required: true },
    storePhoto: { type: String, required: false },
    storeAddress: { type: String, required: false },
    openingTime: { type: String, required: true },
    closingTime: { type: String, required: true },
    verificationCode: { type: String, required: true },
    products: [{ type: Types.ObjectId, ref: "Product" }],
    orderId: [{ type: Types.ObjectId, ref: "Order" }]
}, { timestamps: true });

const Vendor = models.Vendor || model("Vendor", VendorSchema)
export default Vendor