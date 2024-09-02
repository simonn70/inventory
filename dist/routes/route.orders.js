"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_orders_1 = require("../controllers/controllers.orders");
const middleware_utils_1 = require("../utils/middleware.utils");
const router = express_1.default.Router();
// Route to create a new order
router.post('/create', middleware_utils_1.protectRoute, controllers_orders_1.createOrder);
// Route to verify payment
router.get('/verify', controllers_orders_1.verifyPayment);
// Route to get all orders
router.get('/', controllers_orders_1.getAllOrders);
// Route to get a single order by ID
router.get('/:orderId', controllers_orders_1.getOrderById);
// Route to update an order by ID
router.put('/:orderId', controllers_orders_1.updateOrder);
// Route to delete an order by ID
router.delete('/:orderId', controllers_orders_1.deleteOrder);
// Route to get orders by partner ID
router.get('/partners/:partnerId', controllers_orders_1.getOrdersByPartner);
// Route to get orders by customer ID
router.get('/customers/:customerId', controllers_orders_1.getOrdersByCustomer);
exports.default = router;
