import { Router } from "express"
import{
    createOrder, getOrder,
    getAllOrders, deleteOrder, updateOrder
} from "../controllers/controllers.orders"

const router = Router()

router.post("/create", createOrder)
router.get("/:id", getOrder)
router.get("/", getAllOrders)
router.put("/:id", updateOrder)
router.delete("/:id", deleteOrder)

export default router