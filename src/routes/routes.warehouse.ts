import express from 'express';

import { createWarehouse } from '../controllers/controllers.warehouse';

const router = express.Router();

// Route to create a new product
router.post('/create', createWarehouse);
// Route to get all products


export default router;
