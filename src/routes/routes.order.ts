import express from 'express';
import {
    createProduct,
    getProducts,
    updateProduct,
    
} from '../controllers/controllers.product';
import { approveOrder, createOrder, fetchOrdersByUserId, fetchPendingOrders } from '../controllers/controllers.order';

const router = express.Router();

// Route to create a new product
router.post('/create', createOrder);
router.post('/approve/:orderId', approveOrder);
router.get('/', fetchPendingOrders);
router.get('/:userId', fetchOrdersByUserId);
router.delete('/:orderId', updateProduct);
// Route to get all products


export default router;
