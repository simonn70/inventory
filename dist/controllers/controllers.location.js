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
exports.setLocation = void 0;
const axios_1 = __importDefault(require("axios"));
const database_1 = require("../database");
const models_location_1 = __importDefault(require("../database/models/models.location"));
const setLocation = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { longitude, latitude, category } = request.body;
    const user = request.user;
    console.log(user);
    try {
        yield (0, database_1.connectToDatabase)();
        // Reverse geocode to get the location name
        const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
        const geocodeResponse = yield axios_1.default.get(geocodeUrl);
        const locationName = geocodeResponse.data.name;
        console.log(geocodeResponse.data);
        // Create a new location instance
        const newLocation = new models_location_1.default({
            longitude,
            latitude,
            user: user._id,
            name: locationName,
            category
        });
        // Save the location to the database
        yield newLocation.save();
        return response.status(200).send({ msg: "Location saved successfully", location: newLocation });
    }
    catch (error) {
        console.error("Error saving location:", error);
        return response.status(500).send({ msg: "Internal server error", error });
    }
});
exports.setLocation = setLocation;
