"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: false },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'partner', 'admin'], required: true },
    phone: { type: String, required: true },
    verificationCode: { type: String, required: false },
    isVerified: { type: Boolean, required: false },
    resetPasswordExpires: { type: Date },
    address: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Address'
        }],
    savedAddresses: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Address'
        }],
    location: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Location'
    },
    profileImage: { type: String },
    notifications: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Notification'
        }],
    services: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Service'
        }],
    chat: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Chat'
        }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
// const User = mongoose.model('User', userSchema);
// module.exports = User;
const User = mongoose_1.models.User || (0, mongoose_1.model)("User", userSchema);
exports.default = User;
