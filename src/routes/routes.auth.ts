import { Router } from "express";
import { login, logout, register,updateProfile,getProfile, verifyAccount } from "../controllers/controllers.auth";
import { protectRoute } from "../utils/middleware.utils";

const router = Router()

router.post("/register", register)
router.post("/login", login)
router.post("/verify-account", verifyAccount)
router.post("/logout", logout)
router.get("/get-profile",protectRoute, getProfile )
router.put("/update-profile",protectRoute, updateProfile)

export default router