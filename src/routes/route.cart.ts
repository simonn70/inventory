import express from 'express';
import { protectRoute } from '../utils/middleware.utils';
import { addToCart, getCart, removeFromCart, updateCartItem } from '../controllers/controllers.cart';


const router = express.Router();

// Add an item to the cart
router.post('/add', protectRoute, addToCart);

// View the user's cart
router.get('/', protectRoute, getCart);

// Update an item in the cart
router.put('/update', protectRoute, updateCartItem);

// Remove an item from the cart
router.delete('/remove', protectRoute, removeFromCart);

export default router;
