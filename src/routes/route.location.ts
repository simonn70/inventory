import { Router } from "express"
import {
    setUserCurrentLocation, setVendorLocation
} from "../controllers/controllers.location"

const router = Router()

router.post("/set-customer", setUserCurrentLocation)
router.post("/set-vendor", setVendorLocation)

export default router