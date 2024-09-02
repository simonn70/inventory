"use strict";
//view their orders
//update order
//create services
//chat feature
//notification
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
exports.updateOrderStatus = exports.addServiceToPartner = exports.getPartnersByService = exports.getPartnerById = exports.getAllPartners = void 0;
const models_customer_1 = __importDefault(require("../../database/models/models.customer"));
const database_1 = require("../../database");
const models_services_1 = __importDefault(require("../../database/models/models.services"));
const models_order_1 = __importDefault(require("../../database/models/models.order"));
// Get all partners
const getAllPartners = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, database_1.connectToDatabase)();
        const partners = yield models_customer_1.default.find({ role: 'partner' })
            .populate('services')
            .populate('location')
            .populate('address')
            .populate('savedAddresses');
        return res.status(200).send(partners);
    }
    catch (error) {
        return res.status(500).send({ msg: 'Error fetching partners', error });
    }
});
exports.getAllPartners = getAllPartners;
// Get partner by ID based on the services they offer
const getPartnerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { partnerId } = req.params;
    try {
        yield (0, database_1.connectToDatabase)();
        const partner = yield models_customer_1.default.findOne({ _id: partnerId, role: 'partner' })
            .populate('services')
            .populate('location')
            .populate('address');
        if (!partner) {
            return res.status(404).send({ msg: 'Partner not found' });
        }
        return res.status(200).send(partner);
    }
    catch (error) {
        return res.status(500).send({ msg: 'Error fetching partner by ID', error });
    }
});
exports.getPartnerById = getPartnerById;
// Get partners by service ID
const getPartnersByService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { serviceId } = req.params;
    try {
        yield (0, database_1.connectToDatabase)();
        const partners = yield models_customer_1.default.find({ role: 'partner', services: serviceId })
            .populate('services')
            .populate('location')
            .populate('address')
            .populate('savedAddresses');
        if (partners.length === 0) {
            return res.status(404).send({ msg: 'No partners found for this service' });
        }
        return res.status(200).send(partners);
    }
    catch (error) {
        return res.status(500).send({ msg: 'Error fetching partners by service', error });
    }
});
exports.getPartnersByService = getPartnersByService;
//update order
// Add service to partner's services
const addServiceToPartner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { partnerId, serviceId } = req.body;
    try {
        yield (0, database_1.connectToDatabase)();
        // Ensure the service exists
        const service = yield models_services_1.default.findById(serviceId);
        if (!service) {
            return res.status(404).send({ msg: 'Service not found' });
        }
        // Find the partner and update their services field
        const updatedPartner = yield models_customer_1.default.findOneAndUpdate({ _id: partnerId, role: 'partner' }, { $addToSet: { services: serviceId } }, // Use $addToSet to avoid duplicates
        { new: true } // Return the updated document
        ).populate('services');
        if (!updatedPartner) {
            return res.status(404).send({ msg: 'Partner not found' });
        }
        return res.status(200).send(updatedPartner);
    }
    catch (error) {
        return res.status(500).send({ msg: 'Error adding service to partner', error });
    }
});
exports.addServiceToPartner = addServiceToPartner;
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const { partnerId } = req.body;
    try {
        yield (0, database_1.connectToDatabase)();
        // Find the order by ID and ensure the partner matches the one associated with the order
        const order = yield models_order_1.default.findOne({ _id: orderId, partner: partnerId });
        if (!order) {
            return res.status(404).send({ msg: 'Order not found or partner does not have permission to update this order' });
        }
        // Update the order status to 'completed'
        order.status = 'completed';
        order.updatedAt = Date.now(); // Update the 'updatedAt' timestamp
        yield order.save();
        return res.status(200).send({ msg: 'Order status updated to completed', order });
    }
    catch (error) {
        return res.status(500).send({ msg: 'Error updating order status', error });
    }
});
exports.updateOrderStatus = updateOrderStatus;
