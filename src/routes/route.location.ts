import { Router } from "express"
import {
    setLocation
} from "../controllers/controllers.location"
import { searchVendors } from "../controllers/controllers.vendor"
import { protectRoute } from "../utils/middleware.utils"

const router = Router()

router.post("/set",protectRoute, setLocation)
router.get("/search", searchVendors)

export default router