"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_product_1 = require("../controllers/controllers.product");
const router = express_1.default.Router();
// Route to create a new product
router.post('/create', controllers_product_1.createProduct);
// Route to get all products
router.get('/', controllers_product_1.getAllProducts);
// Route to get products by service ID
router.get('/services/:serviceId', controllers_product_1.getProductsByService);
// Route to get a single product by ID
router.get('/:productId', controllers_product_1.getProductById);
// Route to update a product by ID
router.put('/:productId', controllers_product_1.updateProduct);
// Route to delete a product by ID
router.delete('/:productId', controllers_product_1.deleteProduct);
exports.default = router;
