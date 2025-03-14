import express, { type Application } from "express"
import cors from "cors"
import helmet from "helmet"
import compression from "compression"
import morgan from "morgan"
import { errorHandler } from "./middlewares/error.middleware"

// Import routes
import authRoutes from "./routes/auth.routes"
import userRoutes from "./routes/user.routes"
import brandRoutes from "./routes/brand.routes"
import productRoutes from "./routes/product.routes"
import accessoryRoutes from "./routes/accessory.routes"
import sparePartRoutes from "./routes/sparePart.routes"

const app: Application = express()

// Middlewares
app.use(cors())
app.use(helmet())
app.use(compression())
app.use(morgan("dev"))
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/brands", brandRoutes)
app.use("/api/products", productRoutes)
app.use("/api/accessories", accessoryRoutes)
app.use("/api/spare-parts", sparePartRoutes)

// Error handler
app.use(errorHandler)

export default app

