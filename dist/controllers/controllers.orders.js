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
exports.getOrdersByCustomer = exports.getOrdersByPartner = exports.deleteOrder = exports.updateOrder = exports.getOrderById = exports.getAllOrders = exports.verifyPayment = exports.createOrder = void 0;
const database_1 = require("../database");
const axios_1 = __importDefault(require("axios"));
const models_order_1 = __importDefault(require("../database/models/models.order"));
const models_product_1 = __importDefault(require("../database/models/models.product"));
const PAYSTACK_SECRET_KEY = "sk_live_b656166f9c8b4216425d78a0ef4c49a390d84cbd";
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { products, location, deliveryTime } = yield req.body;
    const customer = req.user;
    try {
        yield (0, database_1.connectToDatabase)();
        // Calculate the total amount
        let totalAmount = 0;
        for (const item of products) {
            const product = yield models_product_1.default.findById(item.product);
            if (!product) {
                return res.status(404).send({ msg: `Product with ID ${item.product} not found` });
            }
            totalAmount += product.price * item.quantity;
        }
        // Create the order
        const newOrder = new models_order_1.default({
            customer: customer._id,
            products,
            totalAmount,
            location,
            deliveryTime
        });
        yield newOrder.save();
        console.log(newOrder);
        const parseTotal = parseFloat(totalAmount);
        console.log(totalAmount);
        // Initiate Paystack payment
        // const user = await User.findById(customer);
        const paymentResponse = yield axios_1.default.post('https://api.paystack.co/transaction/initialize', {
            email: 'simon@gmail.com',
            amount: Math.round(parseTotal * 100), // Paystack expects the amount in kobo (or smallest currency unit)
            metadata: {
                orderId: newOrder._id
            }, channels: ["card", "mobile_money"],
        }, {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
            }
        });
        console.log(paymentResponse.data);
        return res.status(201).send({
            order: newOrder,
            paymentUrl: paymentResponse.data.data.authorization_url
        });
    }
    catch (error) {
        return res.status(500).send({ msg: 'Error creating order', error });
    }
});
exports.createOrder = createOrder;
const verifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reference } = req.query;
    try {
        yield (0, database_1.connectToDatabase)();
        // Verify payment with Paystack
        const paymentVerificationResponse = yield axios_1.default.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
            }
        });
        const { status, amount, metadata } = paymentVerificationResponse.data.data;
        if (status === 'success') {
            // Update the order
            const order = yield models_order_1.default.findById(metadata.orderId);
            if (!order) {
                return res.status(404).send({ msg: 'Order not found' });
            }
            order.paymentStatus = 'paid';
            order.status = 'confirmed';
            order.totalAmount = amount / 100; // Convert back from kobo
            yield order.save();
            return res.status(200).send({ msg: 'Payment successful and order confirmed', order });
        }
        else {
            return res.status(400).send({ msg: 'Payment verification failed' });
        }
    }
    catch (error) {
        return res.status(500).send({ msg: 'Error verifying payment', error });
    }
});
exports.verifyPayment = verifyPayment;
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, database_1.connectToDatabase)();
        const orders = yield models_order_1.default.find().populate('customer partner products.product location');
        return res.status(200).send(orders);
    }
    catch (error) {
        return res.status(500).send({ msg: 'Error fetching orders', error });
    }
});
exports.getAllOrders = getAllOrders;
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    try {
        yield (0, database_1.connectToDatabase)();
        const order = yield models_order_1.default.findById(orderId).populate('customer partner products.product location');
        if (!order) {
            return res.status(404).send({ msg: 'Order not found' });
        }
        return res.status(200).send(order);
    }
    catch (error) {
        return res.status(500).send({ msg: 'Error fetching order', error });
    }
});
exports.getOrderById = getOrderById;
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const updateData = req.body;
    try {
        yield (0, database_1.connectToDatabase)();
        const updatedOrder = yield models_order_1.default.findByIdAndUpdate(orderId, updateData, { new: true });
        if (!updatedOrder) {
            return res.status(404).send({ msg: 'Order not found' });
        }
        return res.status(200).send(updatedOrder);
    }
    catch (error) {
        return res.status(500).send({ msg: 'Error updating order', error });
    }
});
exports.updateOrder = updateOrder;
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    try {
        yield (0, database_1.connectToDatabase)();
        const deletedOrder = yield models_order_1.default.findByIdAndDelete(orderId);
        if (!deletedOrder) {
            return res.status(404).send({ msg: 'Order not found' });
        }
        return res.status(200).send({ msg: 'Order deleted successfully' });
    }
    catch (error) {
        return res.status(500).send({ msg: 'Error deleting order', error });
    }
});
exports.deleteOrder = deleteOrder;
const getOrdersByPartner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { partnerId } = req.params;
    try {
        yield (0, database_1.connectToDatabase)();
        const orders = yield models_order_1.default.find({ partner: partnerId });
        if (!orders.length) {
            return res.status(404).send({ msg: 'No orders found for this partner' });
        }
        return res.status(200).send(orders);
    }
    catch (error) {
        return res.status(500).send({ msg: 'Error fetching orders by partner', error });
    }
});
exports.getOrdersByPartner = getOrdersByPartner;
const getOrdersByCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerId } = req.params;
    try {
        yield (0, database_1.connectToDatabase)();
        const orders = yield models_order_1.default.find({ customer: customerId });
        if (!orders.length) {
            return res.status(404).send({ msg: 'No orders found for this customer' });
        }
        return res.status(200).send(orders);
    }
    catch (error) {
        return res.status(500).send({ msg: 'Error fetching orders by customer', error });
    }
});
exports.getOrdersByCustomer = getOrdersByCustomer;
