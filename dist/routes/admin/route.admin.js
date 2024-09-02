"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_admin_1 = require("../../controllers/admin/controllers.admin");
const router = (0, express_1.Router)();
router.get('/partners', controllers_admin_1.viewAllPartners);
router.get('/customers', controllers_admin_1.viewAllCustomers);
router.post('/assign-order', controllers_admin_1.assignOrderToPartner);
router.get('/orders', controllers_admin_1.viewAllOrders);
// router.get("/:storeId", getProductByStoreId)
// router.put("/update/:id", updateProductById)
// router.delete("/delete/:id", deleteProductById)
exports.default = router;
