

import { Router } from "express";
import { assignOrderToPartner, viewAllCustomers, viewAllOrders, viewAllPartners } from "../../controllers/admin/controllers.admin";


const router = Router()

router.get('/partners', viewAllPartners);
router.get('/customers', viewAllCustomers);
router.post('/assign-order', assignOrderToPartner);
router.get('/orders', viewAllOrders);
// router.get("/:storeId", getProductByStoreId)
// router.put("/update/:id", updateProductById)
// router.delete("/delete/:id", deleteProductById)



export default router