import { Router } from "express"
import AuthController from "../controllers/auth.controller"
import { authenticate } from "../middlewares/auth.middleware"

const router = Router()

// Public routes
router.post("/register", AuthController.register)
router.post("/login", AuthController.login)

// Protected routes
router.get("/me", authenticate, AuthController.getCurrentUser)

export default router