import { Schema, Types, model, models } from "mongoose";



const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  // Role-based permissions
password: { type: String, unique: true, required:true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});



const User = models.User || model("User", userSchema)
export default User