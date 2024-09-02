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
exports.updateProfile = exports.getProfile = exports.resetPassword = exports.sendPasswordResetEmail = exports.login = exports.resendVerificationCode = exports.verifyAccount = exports.register = void 0;
const validation_utils_1 = require("../utils/validation.utils");
const services_utils_1 = __importDefault(require("../utils/services.utils"));
const database_1 = require("../database");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // Assuming you're using JWT for authentication
const models_customer_1 = __importDefault(require("../database/models/models.customer"));
const sendSms_utils_1 = require("../utils/sendSms.utils");
const register = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let { role, name, email, phone, password, repeatPassword } = request.body;
    // Check if passwords match
    if (!(0, validation_utils_1.passwordsMatch)(password, repeatPassword)) {
        return response.status(400).send({
            successful: false,
            msg: "Passwords don't match"
        });
    }
    try {
        // Ensure the database is connected
        // Check if user with the same email or phone number already exists
        const existingUser = yield models_customer_1.default.findOne({
            $or: [
                { email: email },
                { phone: phone }
            ]
        });
        if (existingUser) {
            return response.status(400).send({
                successful: false,
                msg: "User with this email or phone number already exists."
            });
        }
        // Generate verification code
        const verificationCode = (0, validation_utils_1.generateVerificationCode)(6);
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Create a new user
        const newUser = new models_customer_1.default({
            role,
            name,
            email,
            phone,
            password: hashedPassword,
            verificationCode
        });
        yield newUser.save();
        const message = ` Hello  ${name} your verification code is  ${verificationCode} kindly enter to verify your account`;
        const number = '0541902075';
        yield (0, sendSms_utils_1.sendSMS)(message, phone);
        // Send verification email (commented out, assuming you will use it)
        // const transporter = nodemailer.createTransport({
        //     service: 'Gmail',
        //     auth: {
        //         user: process.env.EMAIL_USERNAME,
        //         pass: process.env.EMAIL_PASSWORD,
        //     },
        // });
        // const mailOptions = {
        //     from: process.env.EMAIL_USERNAME,
        //     to: email,
        //     subject: 'Account Verification',
        //     text: `Your verification code is: ${verificationCode}`,
        // };
        // await transporter.sendMail(mailOptions);
        return response.status(201).send({
            successful: true,
            msg: "User created! Verification email sent.",
            newUser
        });
    }
    catch (error) {
        console.error('Error during registration:', error);
        return response.status(500).send({
            successful: false,
            msg: "Registration failed."
        });
    }
});
exports.register = register;
const verifyAccount = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone, verificationCode } = yield request.body;
    try {
        yield (0, database_1.connectToDatabase)();
        const user = yield models_customer_1.default.findOne({ phone });
        if (!user) {
            return response.status(404).send({ msg: "User not found" });
        }
        console.log(user.verificationCode);
        // Verify code (Assuming you stored the verification code in the DB)
        if (user.verificationCode !== verificationCode) {
            return response.status(400).send({ msg: "Invalid verification code" });
        }
        // Mark user as verified
        user.isVerified = true;
        user.verificationCode = undefined;
        yield user.save();
        return response.status(200).send({ msg: "Account verified successfully", user });
    }
    catch (error) {
        console.error('Error during account verification:', error);
        return response.status(500).send({ msg: "Verification failed" });
    }
});
exports.verifyAccount = verifyAccount;
const resendVerificationCode = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const user = request.user;
    // Assuming userId is attached to the request
    try {
        // Find user by userId
        // const user = await User.findById(userId)
        if (!user) {
            return response.status(404).send({
                successful: false,
                msg: "User not found."
            });
        }
        // Generate a new verification code
        const newVerificationCode = (0, validation_utils_1.generateVerificationCode)(6);
        user.verificationCode = newVerificationCode;
        yield user.save();
        // Optionally send the code via email
        // if (user.email) {
        //     const transporter = nodemailer.createTransport({
        //         service: 'Gmail',
        //         auth: {
        //             user: process.env.EMAIL_USERNAME,
        //             pass: process.env.EMAIL_PASSWORD,
        //         },
        //     });
        //     const mailOptions = {
        //         from: process.env.EMAIL_USERNAME,
        //         to: user.email,
        //         subject: 'Resend Verification Code',
        //         text: `Your new verification code is: ${newVerificationCode}`,
        //     };
        //     await transporter.sendMail(mailOptions);
        // }
        // Optionally send the code via SMS
        // if (user.phone) {
        //     // Code to send SMS via an SMS provider (e.g., Twilio)
        // }
        return response.status(200).send({
            successful: true,
            msg: "Verification code resent successfully.", newVerificationCode
        });
    }
    catch (error) {
        console.error('Error resending verification code:', error);
        return response.status(500).send({
            successful: false,
            msg: "Failed to resend verification code."
        });
    }
});
exports.resendVerificationCode = resendVerificationCode;
const login = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, phone, password } = request.body;
    try {
        // Ensure the database is connected
        yield (0, database_1.connectToDatabase)();
        // Find the user by email and role
        const user = yield models_customer_1.default.findOne({ phone, role });
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
const sendPasswordResetEmail = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone } = request.body;
    try {
        // Ensure the database is connected
        yield (0, database_1.connectToDatabase)();
        // Find the user by email
        const user = yield models_customer_1.default.findOne({ phone });
        if (!user) {
            return response.status(404).send({ msg: "User not found" });
        }
        // Generate a reset token
        const verificationCode = (0, validation_utils_1.generateVerificationCode)(6);
        // Set the token's expiry time (e.g., 1 hour from now)
        const tokenExpiry = Date.now() + 3600000; // 1 hour in milliseconds
        // Store the token and expiry in the user's document
        user.verificationCode = verificationCode;
        user.resetPasswordExpires = tokenExpiry;
        yield user.save();
        // Send the email with nodemailer
        // const transporter = nodemailer.createTransport({
        //     service: "Gmail",
        //     auth: {
        //         user: process.env.EMAIL_USERNAME,
        //         pass: process.env.EMAIL_PASSWORD,
        //     },
        // });
        // const mailOptions = {
        //     to: email,
        //     from: process.env.EMAIL_USERNAME,
        //     subject: "Password Reset",
        //     text: `You are receiving this because you (or someone else) have requested to reset your password.\n\n
        //     Please click on the following link, or paste it into your browser to complete the process:\n\n
        //     ${verificationCode}\n\n
        //     If you did not request this, please ignore this email and your password will remain unchanged.\n`
        // };
        // await transporter.sendMail(mailOptions);
        const message = `You are receiving this because you (or someone else) have requested to reset your password.\n\n
            Please click on the following link, or paste it into your browser to complete the process:\n\n
            ${verificationCode}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`;
        yield (0, sendSms_utils_1.sendSMS)(message, phone);
        return response.status(200).send({ msg: "Password reset email sent" });
    }
    catch (error) {
        console.error("Error sending password reset email:", error);
        return response.status(500).send({ msg: "Failed to send password reset email" });
    }
});
exports.sendPasswordResetEmail = sendPasswordResetEmail;
const resetPassword = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { verifcationCode, newPassword } = request.body;
    try {
        // Ensure the database is connected
        yield (0, database_1.connectToDatabase)();
        // Find the user by email and ensure the token is valid and not expired
        const user = yield models_customer_1.default.findOne({
            verifcationCode,
            resetPasswordExpires: { $gt: Date.now() } // Check that the token is not expired
        });
        if (!user) {
            return response.status(400).send({ msg: "Invalid or expired token" });
        }
        // Hash the new password
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        // Update the user's password and clear the reset token and expiry
        user.password = hashedPassword;
        user.verificationCode = undefined;
        user.resetPasswordExpires = undefined;
        yield user.save();
        return response.status(200).send({ msg: "Password has been reset successfully" });
    }
    catch (error) {
        console.error("Error resetting password:", error);
        return response.status(500).send({ msg: "Failed to reset password" });
    }
});
exports.resetPassword = resetPassword;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user; // Assuming you have a middleware that sets req.user and req.role
        res.status(200).json(user);
    }
    catch (error) {
        console.error('Error fetching customer profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getProfile = getProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user; // Assuming you have a middleware that sets req.user and req.role
        const updatedData = req.body;
        const updatedProfile = yield (0, services_utils_1.default)(user._id, user.role, updatedData);
        if (!updatedProfile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.status(200).json(updatedProfile);
    }
    catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateProfile = updateProfile;
