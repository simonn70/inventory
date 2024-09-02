"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_services_1 = require("../controllers/controllers.services");
const router = express_1.default.Router();
// Route to create a new service
router.post('/create', controllers_services_1.createService);
// Route to get all services
router.get('/', controllers_services_1.getAllServices);
// Route to get a single service by ID
router.get('/:serviceId', controllers_services_1.getServiceById);
// Route to update a service by ID
router.put('/:serviceId', controllers_services_1.updateService);
// Route to delete a service by ID
router.delete('/:serviceId', controllers_services_1.deleteService);
exports.default = router;
