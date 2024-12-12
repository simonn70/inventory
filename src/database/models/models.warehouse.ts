import { Schema, Types, model, models } from "mongoose";

const WarehouseSchema = new Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  capacity: { type: Number }, // Maximum stock capacity
  managerId: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const Warehouse = models.Warehouse || model("Warehouse", WarehouseSchema)
export default Warehouse
