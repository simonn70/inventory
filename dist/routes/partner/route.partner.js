"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_partner_1 = require("../../controllers/partner/controllers.partner"); // Adjust the import path as needed
const router = express_1.default.Router();
// Route to get all partners
router.get('/', controllers_partner_1.getAllPartners);
// Route to get a partner by ID
router.get('/:partnerId', controllers_partner_1.getPartnerById);
// Route to get partners by service ID
router.get('/service/:serviceId', controllers_partner_1.getPartnersByService);
// Route to add a service to a partner's services
router.post('/add-service', controllers_partner_1.addServiceToPartner);
// Route to update the status of an order to 'completed'
router.put('/orders/:orderId/status', controllers_partner_1.updateOrderStatus);
exports.default = router;
