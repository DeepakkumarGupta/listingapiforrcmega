import { Router } from "express"
import ProductController from "../controllers/product.controller"
import { authenticate } from "../middlewares/auth.middleware"

const router = Router()

// Public routes
router.get("/", ProductController.getAllProducts)
router.get("/:id", ProductController.getProductById)
router.get("/slug/:slug", ProductController.getProductBySlug)
router.get("/:id/spare-parts", ProductController.getProductWithSpareParts)
router.get("/:id/accessories", ProductController.getProductWithAccessories)
router.get("/:id/complete", ProductController.getCompleteProductInfo)

// Protected routes (require authentication)
router.post("/", authenticate, ProductController.createProduct)
router.put("/:id", authenticate, ProductController.updateProduct)
router.delete("/:id", authenticate, ProductController.deleteProduct)

export default router

