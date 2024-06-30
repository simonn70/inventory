import { Schema, Types, model, models } from "mongoose";

const DeliveryGuySchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    photo: { type: String, required: true },
    ID: { type: String, required: true },
    gender: { type: String, required: true },
    license: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    orderId: [{ type: Types.ObjectId, ref: "Order" }]
}, { timestamps: true })

const DeliveryGuy = models.DeliveryGuy || model("DeliveryGuy", DeliveryGuySchema)
export default DeliveryGuy