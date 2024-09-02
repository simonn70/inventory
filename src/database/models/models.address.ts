import { Schema, Types, model, models } from "mongoose";


const addressSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    location: {
        type: Schema.Types.ObjectId,
        ref: 'Location'
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});




const Address = models.Address || model("Address",addressSchema)
export default Address