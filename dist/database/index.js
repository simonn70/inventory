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
exports.connectToDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const MONGODB_URI = "mongodb+srv://simonadjei70:QzlvSvnAxDMGaozU@cluster0.cgdpa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
if (!MONGODB_URI) {
    throw new Error("MONGODB URI is missing");
}
if (!global.mongoose) {
    global.mongoose = { conn: null, promise: null };
}
let cached = global.mongoose;
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    if (cached.conn)
        return cached.conn;
    cached.conn = cached.promise || mongoose_1.default.connect(MONGODB_URI, {
        dbName: "laundry",
    });
    cached.conn = yield cached.promise;
    return cached.conn;
});
exports.connectToDatabase = connectToDatabase;
