"use strict";
// view all partners
//view customers
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
exports.viewAllCustomers = exports.assignOrderToPartner = exports.viewAllOrders = exports.viewAllPartners = void 0;
const models_customer_1 = __importDefault(require("../../database/models/models.customer"));
const models_order_1 = __importDefault(require("../../database/models/models.order"));
// assign orders to partners
const viewAllPartners = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const partners = yield models_customer_1.default.find();
        res.status(200).json({ successful: true, partners });
    }
    catch (error) {
        console.error('Error fetching partners:', error);
        res.status(500).json({ successful: false, msg: 'Failed to fetch partners' });
    }
});
exports.viewAllPartners = viewAllPartners;
const viewAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield models_order_1.default.find(); // Populating customer and assignedPartner fields
        res.status(200).json({ successful: true, orders });
    }
    catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ successful: false, msg: 'Failed to fetch orders' });
    }
});
exports.viewAllOrders = viewAllOrders;
const assignOrderToPartner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId, partnerId } = req.body;
    try {
        const order = yield models_order_1.default.findById(orderId);
        if (!order) {
            return res.status(404).json({ successful: false, msg: 'Order not found' });
        }
        const partner = yield models_customer_1.default.findById(partnerId);
        if (!partner) {
            return res.status(404).json({ successful: false, msg: 'Partner not found' });
        }
        order.assignedPartner = partnerId; // Assuming you have an `assignedPartner` field in your Order schema
        yield order.save();
        res.status(200).json({ successful: true, msg: 'Order assigned to partner successfully', order });
    }
    catch (error) {
        console.error('Error assigning order to partner:', error);
        res.status(500).json({ successful: false, msg: 'Failed to assign order to partner' });
    }
});
exports.assignOrderToPartner = assignOrderToPartner;
const viewAllCustomers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customers = yield models_customer_1.default.find();
        res.status(200).json({ successful: true, customers });
    }
    catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ successful: false, msg: 'Failed to fetch customers' });
    }
});
exports.viewAllCustomers = viewAllCustomers;
