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
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProductsByService = exports.getAllProducts = exports.createProduct = void 0;
const database_1 = require("../database");
const models_product_1 = __importDefault(require("../database/models/models.product"));
// Create a new product
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, service, productType, price, imageUrl } = yield req.body;
    // Assuming this is set by middleware
    try {
        yield (0, database_1.connectToDatabase)();
        const newProduct = new models_product_1.default({
            name,
            description,
            service,
            productType,
            price,
            imageUrl,
        });
        const savedProduct = yield newProduct.save();
        return res.status(201).send({ msg: 'Product created successfully', product: savedProduct });
    }
    catch (error) {
        return res.status(500).send({ msg: 'Error creating product', error });
    }
});
exports.createProduct = createProduct;
// Fetch all products
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, database_1.connectToDatabase)();
        const products = yield models_product_1.default.find().populate('service');
        return res.status(200).send(products);
    }
    catch (error) {
        return res.status(500).send({ msg: 'Error fetching products', error });
    }
});
exports.getAllProducts = getAllProducts;
// Fetch products by service
const getProductsByService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { serviceId } = req.params;
    try {
        yield (0, database_1.connectToDatabase)();
        const products = yield models_product_1.default.find({ service: serviceId }).populate('service').populate('createdBy');
        return res.status(200).send(products);
    }
    catch (error) {
        return res.status(500).send({ msg: 'Error fetching products by service', error });
    }
});
exports.getProductsByService = getProductsByService;
// Fetch product by ID
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    try {
        yield (0, database_1.connectToDatabase)();
        const product = yield models_product_1.default.findById(productId).populate('service').populate('createdBy');
        if (!product) {
            return res.status(404).send({ msg: 'Product not found' });
        }
        return res.status(200).send(product);
    }
    catch (error) {
        return res.status(500).send({ msg: 'Error fetching product by ID', error });
    }
});
exports.getProductById = getProductById;
// Update product
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const updates = req.body;
    try {
        yield (0, database_1.connectToDatabase)();
        const updatedProduct = yield models_product_1.default.findByIdAndUpdate(productId, updates, { new: true }).populate('service').populate('createdBy');
        if (!updatedProduct) {
            return res.status(404).send({ msg: 'Product not found' });
        }
        return res.status(200).send({ msg: 'Product updated successfully', product: updatedProduct });
    }
    catch (error) {
        return res.status(500).send({ msg: 'Error updating product', error });
    }
});
exports.updateProduct = updateProduct;
// Delete product
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    try {
        yield (0, database_1.connectToDatabase)();
        const deletedProduct = yield models_product_1.default.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).send({ msg: 'Product not found' });
        }
        return res.status(200).send({ msg: 'Product deleted successfully' });
    }
    catch (error) {
        return res.status(500).send({ msg: 'Error deleting product', error });
    }
});
exports.deleteProduct = deleteProduct;
