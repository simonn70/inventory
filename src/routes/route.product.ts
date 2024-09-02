import express from 'express';
import {
    createProduct,
    getAllProducts,
    getProductsByService,
    getProductById,
    updateProduct,
    deleteProduct
} from '../controllers/controllers.product';

const router = express.Router();

// Route to create a new product
router.post('/create', createProduct);

// Route to get all products
router.get('/', getAllProducts);

// Route to get products by service ID
router.get('/services/:serviceId', getProductsByService);

// Route to get a single product by ID
router.get('/:productId', getProductById);

// Route to update a product by ID
router.put('/:productId', updateProduct);

// Route to delete a product by ID
router.delete('/:productId', deleteProduct);

export default router;
