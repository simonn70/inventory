import { Router } from "express"
import {
    setLocation
} from "../controllers/controllers.location"

const router = Router()

router.post("/set", setLocation)

export default router