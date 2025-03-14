import { Router } from "express"
import AccessoryController from "../controllers/accessory.controller"
import { authenticate } from "../middlewares/auth.middleware"

const router = Router()

// Public routes
router.get("/", AccessoryController.getAllAccessories)
router.get("/:id", AccessoryController.getAccessoryById)
router.get("/slug/:slug", AccessoryController.getAccessoryBySlug)
router.get("/product/:productId", AccessoryController.getAccessoriesForProduct)

// Protected routes (require authentication)
router.post("/", authenticate, AccessoryController.createAccessory)
router.put("/:id", authenticate, AccessoryController.updateAccessory)
router.delete("/:id", authenticate, AccessoryController.deleteAccessory)

export default router

