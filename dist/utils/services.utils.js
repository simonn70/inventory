"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUserLocation = exports.getUserByRole = exports.logIn = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_customer_1 = __importDefault(require("../database/models/models.customer"));
const database_1 = require("../database");
const models_customer_2 = __importDefault(require("../database/models/models.customer"));
const jwtSecret = process.env.JWT_SECRET;
const logIn = (role, model, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, database_1.connectToDatabase)();
        let genericUser;
        if (role == "Vendor") {
            genericUser = yield model.findOne({ storeEmail: email });
        }
        else {
            genericUser = yield model.findOne({ email });
        }
        if (!genericUser) {
            return JSON.stringify({ msg: "user  not found!" });
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, genericUser.password);
        if (!passwordMatch) {
            return JSON.stringify({ msg: "Auth failed" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: genericUser._id, email: genericUser.email, role: role }, jwtSecret, { expiresIn: "1h" });
        if (role == "Vendor") {
            return JSON.stringify({
                name: genericUser.storeName,
                email: genericUser.storeEmail,
                token: token
            });
        }
        else {
            return JSON.stringify({
                name: genericUser.name,
                email: genericUser.email,
                token: token
            });
        }
    }
    catch (error) {
        throw error;
    }
});
exports.logIn = logIn;
const getUserByRole = (id, role) => __awaiter(void 0, void 0, void 0, function* () {
    let user;
    yield (0, database_1.connectToDatabase)();
    switch (role) {
        case 'Customer':
            user = yield models_customer_2.default.findById(id).select('-password');
            break;
        case 'Vendor':
            user = yield models_customer_2.default.findById(id).select('-password');
        default:
            throw new Error('Invalid user role');
    }
    return user;
});
exports.getUserByRole = getUserByRole;
const updateUserByRole = (id, role, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    const options = { new: true, runValidators: true }; // Return the updated document and run validators
    yield (0, database_1.connectToDatabase)();
    let updatedUser;
    switch (role) {
        case 'Customer':
            updatedUser = yield models_customer_1.default.findByIdAndUpdate(id, updatedData, options).select('-password');
            break;
        case 'Vendor':
            updatedUser = yield models_customer_2.default.findByIdAndUpdate(id, updatedData, options).select('-password');
        default:
            throw new Error('Invalid user role');
    }
    return updatedUser;
});
const setUserLocation = (model, longitude, latitude, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, database_1.connectToDatabase)();
        const genericUser = yield model.findById(userId);
        if (!genericUser) {
            return JSON.stringify({ msg: "could not find user" });
        }
        genericUser.location = {
            type: "Point",
            coordinates: [longitude, latitude]
        };
        yield genericUser.save();
        return JSON.stringify({ msg: "location updated" });
    }
    catch (error) {
        throw error;
    }
});
exports.setUserLocation = setUserLocation;
exports.default = updateUserByRole;
