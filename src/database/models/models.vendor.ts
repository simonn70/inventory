import { Schema, Types, model, models } from "mongoose";

const VendorSchema = new Schema({
    storeName: { type: String, required: true },
    category: [String],
    phoneNumber: { type: String, required: true },
    storeEmail: { type: String, required: true },
    password: { type: String, required: true },
    storePhoto: { type: String, required: true },
    storeAddress: { type: String, required: true },
    storeTiming: { type: String, required: true },
    products: [
        {
            productName: String,
            price: String,
        }
    ],
    orderId: [{ type: Types.ObjectId, ref: "Order" }]
}, { timestamps: true })

const Vendor = models.Vendor || model("Vendor", VendorSchema)
export default Vendor