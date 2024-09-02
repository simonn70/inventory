import { Schema, Types, model, models } from "mongoose";

const locationSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});



const Location = models.Location || model("Location", locationSchema)
export default Location