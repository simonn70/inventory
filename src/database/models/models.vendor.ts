import { Schema, Types, model, models } from "mongoose";

const VendorSchema = new Schema({
    storeName: { type: String, required: false },
    category: [String],
    phoneNumber: { type: String, required: false },
    storeEmail: { type: String, required: false },
    password: { type: String, required: false },
    storePhoto: { type: String, required: false },
    storeAddress: { type: String, required: false },
    openingTime: { type: String, required: false },
    closingTime: { type: String, required: false },
    verificationCode: { type: String, required: false },
    products: [{ type: Types.ObjectId, ref: "Product" }],
    orderId: [{ type: Types.ObjectId, ref: "Order" }],
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true } 
    }
}, { timestamps: true });

VendorSchema.index({ location: "2dsphere"})

const Vendor = models.Vendor || model("Vendor", VendorSchema)
export default Vendor