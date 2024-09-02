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
exports.login = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
// Adjust the path as needed
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // Assuming you're using JWT for authentication
const models_customer_1 = __importDefault(require("../database/models/models.customer"));
const database_1 = require("../database");
const models_customer_2 = __importDefault(require("../database/models/models.customer"));
const registerUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ name, email, phoneNumber, password, verificationCode, role }) {
    try {
        yield (0, database_1.connectToDatabase)();
        switch (role) {
            case "customer":
                return yield models_customer_1.default.create({
                    name,
                    email,
                    phoneNumber,
                    password,
                    verificationCode
                });
            case "admin":
                return yield models_customer_2.default.create({
                    name,
                    email,
                    phoneNumber,
                    password,
                    verificationCode
                });
            case "partner":
                return yield models_customer_2.default.create({
                    storeName: name,
                    storeEmail: email,
                    phoneNumber,
                    password,
                    verificationCode
                });
        }
    }
    catch (error) {
        throw error;
    }
});
exports.registerUser = registerUser;
const login = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, email, password } = request.body;
    try {
        // Ensure the database is connected
        yield (0, database_1.connectToDatabase)();
        // Find the user by email and role
        const user = yield models_customer_2.default.findOne({ email, role });
        if (!user) {
            return response.status(401).send({ msg: "Invalid email or password" });
        }
        // Compare the provided password with the stored hashed password
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return response.status(401).send({ msg: "Invalid email or password" });
        }
        if (!user.isVerified) {
            return response.status(403).send({ msg: "Account not verified" });
        }
        // Generate a token (assuming you're using JWT)
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'defaultsecret', { expiresIn: '1h' } // Set token expiration as needed
        );
        // Send back the token and user data
        return response.status(200).send({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                // Include any other user fields you want to return
            }
        });
    }
    catch (error) {
        console.error('Error during login:', error);
        return response.status(500).send({ msg: "Login failed" });
    }
});
exports.login = login;
//get profile details  for user roles
// check role of each user and based on that fetch their profile details
