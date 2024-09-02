"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const locationSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
const Location = mongoose_1.models.Location || (0, mongoose_1.model)("Location", locationSchema);
exports.default = Location;
