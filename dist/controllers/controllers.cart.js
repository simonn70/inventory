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
exports.removeFromCart = exports.updateCartItem = exports.getCart = exports.addToCart = void 0;
const database_1 = require("../database");
const models_product_1 = __importDefault(require("../database/models/models.product"));
const models_cart_1 = __importDefault(require("../database/models/models.cart"));
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, quantity } = req.body;
    const user = req.user;
    try {
        yield (0, database_1.connectToDatabase)();
        // Find the product
        const product = yield models_product_1.default.findById(productId);
        if (!product) {
            return res.status(404).send({ msg: 'Product not found' });
        }
        // Find the user's cart
        let cart = yield models_cart_1.default.findOne({ user: user._id });
        // If cart doesn't exist, create a new one
        if (!cart) {
            cart = new models_cart_1.default({
                user: user._id,
                items: [{ product: productId, quantity }],
                totalAmount: product.price * quantity
            });
        }
        else {
            // Check if the product is already in the cart
            const cartItem = cart.items.find(item => item.product.toString() === productId);
            if (cartItem) {
                // Update quantity and total amount
                cartItem.quantity += quantity;
            }
            else {
                // Add new product to the cart
                cart.items.push({ product: productId, quantity });
            }
            // Update the total amount
            cart.totalAmount += product.price * quantity;
        }
        // Save the cart
        yield cart.save();
        return res.status(200).send(cart);
    }
    catch (error) {
        return res.status(500).send({ msg: 'Error adding to cart', error });
    }
});
exports.addToCart = addToCart;
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        yield (0, database_1.connectToDatabase)();
        // Find the user's cart
        const cart = yield models_cart_1.default.find({ user: user._id });
        if (!cart) {
            return res.status(404).send({ msg: 'Cart not found' });
        }
        return res.status(200).send(cart);
    }
    catch (error) {
        return res.status(500).send({ msg: 'Error fetching cart', error });
    }
});
exports.getCart = getCart;
const updateCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, quantity } = req.body;
    const user = req.user;
    try {
        yield (0, database_1.connectToDatabase)();
        // Find the user's cart
        const cart = yield models_cart_1.default.findOne({ user: user._id });
        if (!cart) {
            return res.status(404).send({ msg: 'Cart not found' });
        }
        // Find the product in the cart
        const cartItem = cart.items.find(item => item.product.toString() === productId);
        if (!cartItem) {
            return res.status(404).send({ msg: 'Product not found in cart' });
        }
        // Update quantity and total amount
        const product = yield models_product_1.default.findById(productId);
        if (!product) {
            return res.status(404).send({ msg: 'Product not found' });
        }
        cart.totalAmount -= cartItem.quantity * product.price;
        cartItem.quantity = quantity;
        cart.totalAmount += quantity * product.price;
        // Save the cart
        yield cart.save();
        return res.status(200).send(cart);
    }
    catch (error) {
        return res.status(500).send({ msg: 'Error updating cart item', error });
    }
});
exports.updateCartItem = updateCartItem;
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.body;
    const user = req.user;
    try {
        yield (0, database_1.connectToDatabase)();
        // Find the user's cart
        const cart = yield models_cart_1.default.findOne({ user: user._id });
        if (!cart) {
            return res.status(404).send({ msg: 'Cart not found' });
        }
        // Find the product in the cart
        const cartItemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (cartItemIndex === -1) {
            return res.status(404).send({ msg: 'Product not found in cart' });
        }
        // Update total amount and remove the item
        const product = yield models_product_1.default.findById(productId);
        if (product) {
            cart.totalAmount -= cart.items[cartItemIndex].quantity * product.price;
        }
        cart.items.splice(cartItemIndex, 1);
        // Save the cart
        yield cart.save();
        return res.status(200).send(cart);
    }
    catch (error) {
        return res.status(500).send({ msg: 'Error removing from cart', error });
    }
});
exports.removeFromCart = removeFromCart;
