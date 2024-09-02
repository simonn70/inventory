"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteService = exports.updateService = exports.getServiceById = exports.getAllServices = exports.createService = void 0;
const database_1 = require("../database");
const models_services_1 = __importDefault(require("../database/models/models.services"));
const createService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    try {
        yield (0, database_1.connectToDatabase)();
        const newService = new models_services_1.default({ name, description });
        yield newService.save();
        return res.status(201).send(newService);
    }
    catch (error) {
        return res.status(500).send({ msg: 'Error creating service', error });
    }
});
exports.createService = createService;
const getAllServices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, database_1.connectToDatabase)();
        const services = yield models_services_1.default.find();
        return res.status(200).send(services);
    }
    catch (error) {
        return res.status(500).send({ msg: 'Error fetching services', error });
    }
});
exports.getAllServices = getAllServices;
const getServiceById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { serviceId } = req.params;
    try {
        yield (0, database_1.connectToDatabase)();
        const service = yield models_services_1.default.findById(serviceId);
        if (!service) {
            return res.status(404).send({ msg: 'Service not found' });
        }
        return res.status(200).send(service);
    }
    catch (error) {
        return res.status(500).send({ msg: 'Error fetching service', error });
    }
});
exports.getServiceById = getServiceById;
const updateService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { serviceId } = req.params;
    const { name, description } = req.body;
    try {
        yield (0, database_1.connectToDatabase)();
        const updatedService = yield models_services_1.default.findByIdAndUpdate(serviceId, { name, description, updatedAt: Date.now() }, { new: true });
        if (!updatedService) {
            return res.status(404).send({ msg: 'Service not found' });
        }
        return res.status(200).send(updatedService);
    }
    catch (error) {
        return res.status(500).send({ msg: 'Error updating service', error });
    }
});
exports.updateService = updateService;
const deleteService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { serviceId } = req.params;
    try {
        yield (0, database_1.connectToDatabase)();
        const deletedService = yield models_services_1.default.findByIdAndDelete(serviceId);
        if (!deletedService) {
            return res.status(404).send({ msg: 'Service not found' });
        }
        return res.status(200).send({ msg: 'Service deleted successfully' });
    }
    catch (error) {
        return res.status(500).send({ msg: 'Error deleting service', error });
    }
});
exports.deleteService = deleteService;
