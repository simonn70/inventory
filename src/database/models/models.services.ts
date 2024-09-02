import { Schema, Types, model, models } from "mongoose";

const serviceSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Service = models.Service || model("Service", serviceSchema)
export default Service

