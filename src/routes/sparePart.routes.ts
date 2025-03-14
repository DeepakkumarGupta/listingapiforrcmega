import { Router } from "express"
import SparePartController from "../controllers/sparePart.controller"
import { authenticate } from "../middlewares/auth.middleware"

const router = Router()

// Public routes
router.get("/", SparePartController.getAllSpareParts)
router.get("/:id", SparePartController.getSparePartById)
router.get("/slug/:slug", SparePartController.getSparePartBySlug)
router.get("/product/:productId", SparePartController.getSparePartsForProduct)

// Protected routes (require authentication)
router.post("/", authenticate, SparePartController.createSparePart)
router.put("/:id", authenticate, SparePartController.updateSparePart)
router.delete("/:id", authenticate, SparePartController.deleteSparePart)

export default router

