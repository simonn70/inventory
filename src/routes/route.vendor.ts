import { Router } from "express";
import { deleteVendorById, getAllVendors, getVendorById, setupVendor } from "../controllers/controllers.vendor";


const router = Router()

router.put("/setup/:id", setupVendor)
router.get("/", getAllVendors)
router.get("/:id", getVendorById)
router.delete("/delete/:id", deleteVendorById)



export default router