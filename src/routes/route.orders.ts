import { Router } from "express"
import{
    createOrder, getOrder,
    getAllOrders, deleteOrder, updateOrder,
    webhook,
    verifyOrderPayment
} from "../controllers/controllers.orders"

const router = Router()

router.post("/create", createOrder)
router.post("/verify",verifyOrderPayment)
router.get("/:id", getOrder)
router.get("/", getAllOrders)
router.put("/:id", updateOrder)
router.delete("/:id", deleteOrder)
router.post("/webhook",webhook)

export default router