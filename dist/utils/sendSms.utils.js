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
exports.sendSMS = void 0;
const axios_1 = __importDefault(require("axios"));
const sendSMS = (message, recipient) => __awaiter(void 0, void 0, void 0, function* () {
    const uelloSendUrl = "https://uellosend.com/quicksend/";
    const api_key = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.=eyJkYXRhIjp7InVzZXJpZCI6MjAzOSwiYXBpU2VjcmV0IjoidzJFclZvcGhSSk1NPXhUIiwiaXNzdWVyIjoiVUVMTE9TRU5EIn19";
    const sender_id = "LaundryBowl";
    try {
        const response = yield axios_1.default.post(uelloSendUrl, {
            api_key: api_key,
            sender_id: sender_id,
            message: message,
            recipient: recipient,
        });
        if (response.data.status === "200") {
            console.log("SMS sent successfully");
        }
        else {
            console.log(`Failed to send SMS: ${response.data.status}`);
        }
    }
    catch (error) {
        console.error("Error sending SMS:", error);
    }
});
exports.sendSMS = sendSMS;
