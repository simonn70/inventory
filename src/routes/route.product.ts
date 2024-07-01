import { Router } from "express";
import { createProduct, deleteProductById, getProductByStoreId, updateProductById } from "../controllers/controllers.product";


const router = Router()

router.post("/create",createProduct )
router.get("/:storeId", getProductByStoreId)
router.put("/update/:id", updateProductById)
router.delete("/delete/:id", deleteProductById)



export default router