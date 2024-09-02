"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_utils_1 = require("../utils/middleware.utils");
const controllers_cart_1 = require("../controllers/controllers.cart");
const router = express_1.default.Router();
// Add an item to the cart
router.post('/add', middleware_utils_1.protectRoute, controllers_cart_1.addToCart);
// View the user's cart
router.get('/', middleware_utils_1.protectRoute, controllers_cart_1.getCart);
// Update an item in the cart
router.put('/update', middleware_utils_1.protectRoute, controllers_cart_1.updateCartItem);
// Remove an item from the cart
router.delete('/remove', middleware_utils_1.protectRoute, controllers_cart_1.removeFromCart);
exports.default = router;
