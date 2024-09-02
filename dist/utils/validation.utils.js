"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVerificationCode = exports.passwordsMatch = void 0;
const passwordsMatch = (password, repeatPassword) => {
    return password == repeatPassword;
};
exports.passwordsMatch = passwordsMatch;
const generateVerificationCode = (length = 6) => {
    const digits = '0123456789';
    let verificationCode = '';
    for (let i = 0; i < length; i++) {
        verificationCode += digits[Math.floor(Math.random() * digits.length)];
    }
    return verificationCode;
};
exports.generateVerificationCode = generateVerificationCode;
