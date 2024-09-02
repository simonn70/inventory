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
exports.searchVendors = exports.deleteVendorById = exports.getVendorById = exports.getAllVendors = exports.setupVendor = void 0;
const models_product_1 = __importDefault(require("../database/models/models.product"));
const database_1 = require("../database");
const models_customer_1 = __importDefault(require("../database/models/models.customer"));
const setupVendor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { storeName, category, storePhoto, storeAddress, openingTime, closingTime } = req.body;
    const vendorId = req.params.id;
    yield (0, database_1.connectToDatabase)();
    try {
        let vendor = yield models_customer_1.default.findByIdAndUpdate(vendorId, {
            storeName,
            category,
            storePhoto,
            storeAddress,
            openingTime,
            closingTime
        }, { new: true, runValidators: true });
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }
        res.status(201).json(vendor);
    }
    catch (error) {
        console.error('Error setting up vendor:', error);
        res.status(400).json({ message: error.message });
    }
});
exports.setupVendor = setupVendor;
const getAllVendors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, database_1.connectToDatabase)();
    try {
        const vendors = yield models_customer_1.default.find();
        res.status(200);
    }
    catch (error) {
        console.error('Error fetcUsers:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getAllVendors = getAllVendors;
const getVendorById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vendorId } = req.params;
    console.log(vendorId);
    yield (0, database_1.connectToDatabase)();
    try {
        const vendor = yield models_customer_1.default.findById(vendorId);
        console.log(vendor);
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }
        res.status(200).json(vendor);
    }
    catch (error) {
        console.error('Error fetching vendor:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getVendorById = getVendorById;
const deleteVendorById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield (0, database_1.connectToDatabase)();
    try {
        const vendor = yield models_customer_1.default.findByIdAndDelete(id);
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }
        yield models_product_1.default.deleteMany({ storeId: vendor._id });
        res.status(200).json({ message: 'Vendor and associated products deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting vendor:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteVendorById = deleteVendorById;
const searchVendors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { longitude, latitude, maxDistance = 5000 } = req.query;
    if (!longitude || !latitude) {
        return res.status(400).json({ message: 'Longitude and latitude are required' });
    }
    try {
        yield (0, database_1.connectToDatabase)();
        const parsedLongitude = parseFloat(longitude);
        const parsedLatitude = parseFloat(latitude);
        const parsedMaxDistance = parseInt(maxDistance);
        if (isNaN(parsedLongitude) || isNaN(parsedLatitude) || isNaN(parsedMaxDistance)) {
            return res.status(400).json({ message: 'Invalid query parameters' });
        }
        const vendors = yield models_customer_1.default.find({
            location: {
                $near: {
                    $maxDistance: parsedMaxDistance,
                    $geometry: {
                        type: "Point",
                        coordinates: [parsedLongitude, parsedLatitude]
                    },
                }
            }
        });
        if (vendors.length === 0) {
            return res.status(404).json({ message: 'no stores found nearby' });
        }
        res.status(200).send(vendors);
    }
    catch (error) {
        console.error('Error searching for nearby stores:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.searchVendors = searchVendors;
