import { Router } from "express"
import BrandController from "../controllers/brand.controller"
import { authenticate } from "../middlewares/auth.middleware"

const router = Router()

// Public routes
router.get("/", BrandController.getAllBrands)
router.get("/:id", BrandController.getBrandById)

// Protected routes (require authentication)
router.post("/", authenticate, BrandController.createBrand)
router.put("/:id", authenticate, BrandController.updateBrand)
router.delete("/:id", authenticate, BrandController.deleteBrand)

export default router

