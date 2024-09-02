import express from 'express';
import { 
    getAllPartners, 
    getPartnerById, 
    getPartnersByService, 
    addServiceToPartner, 
    updateOrderStatus 
} from '../../controllers/partner/controllers.partner'; // Adjust the import path as needed

const router = express.Router();

// Route to get all partners
router.get('/', getAllPartners);

// Route to get a partner by ID
router.get('/:partnerId', getPartnerById);

// Route to get partners by service ID
router.get('/service/:serviceId', getPartnersByService);

// Route to add a service to a partner's services
router.post('/add-service', addServiceToPartner);

// Route to update the status of an order to 'completed'
router.put('/orders/:orderId/status', updateOrderStatus);

export default router;
