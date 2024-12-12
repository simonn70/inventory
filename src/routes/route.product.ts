import express from 'express';
import {
    createProduct,
    deleteProduct,
    getProducts,
    updateProduct,
    
} from '../controllers/controllers.product';

const router = express.Router();

// Route to create a new product
router.post('/create', createProduct);
router.get('/all', getProducts);
router.put('/:id', updateProduct);
router.delete('/:productId', deleteProduct);
// Route to get all products


export default router;
