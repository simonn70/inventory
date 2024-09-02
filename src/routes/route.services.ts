import express from 'express';
import {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService
} from '../controllers/controllers.services';

const router = express.Router();

// Route to create a new service
router.post('/create', createService);

// Route to get all services
router.get('/', getAllServices);

// Route to get a single service by ID
router.get('/:serviceId', getServiceById);

// Route to update a service by ID
router.put('/:serviceId', updateService);

// Route to delete a service by ID
router.delete('/:serviceId', deleteService);

export default router;
