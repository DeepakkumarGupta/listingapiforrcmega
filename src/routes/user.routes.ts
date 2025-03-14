import { Router } from "express"
import UserController from "../controllers/user.controller"
import { authenticate } from "../middlewares/auth.middleware"

const router = Router()

// All routes require authentication
router.use(authenticate)

router.get("/", UserController.getAllUsers)
router.get("/:id", UserController.getUserById)
router.put("/:id", UserController.updateUser)
router.put("/:id/password", UserController.updatePassword)
router.delete("/:id", UserController.deleteUser)

export default router

