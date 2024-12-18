import express from 'express';
import {
    createProduct,
    getProducts,
    updateProduct,
    
} from '../controllers/controllers.product';
import { approveOrder, rejectOrder, createOrder, fetchOrdersByUserId, fetchPendingOrders, trackOrdersByMonth } from '../controllers/controllers.order';

const router = express.Router();

// Route to create a new product
router.post('/create', createOrder);
router.post('/approve/:orderId', approveOrder);
router.post('/reject/:orderId', rejectOrder);
router.get('/', fetchPendingOrders);
router.get('/track',trackOrdersByMonth );
router.get('/:userId', fetchOrdersByUserId);
router.delete('/:orderId', updateProduct);
// Route to get all products


export default router;
