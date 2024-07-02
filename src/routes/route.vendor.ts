import { Router } from "express";
import {
    deleteVendorById, getAllVendors,
    getVendorById, setupVendor, searchVendors
} from "../controllers/controllers.vendor";

const router = Router()

router.put("/setup/:id", setupVendor)
router.get("/", getAllVendors)
router.get("/:vendorId", getVendorById)
router.delete("/delete/:id", deleteVendorById)




export default router