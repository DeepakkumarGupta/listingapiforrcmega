import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import config from "./config"

// Import routes
import authRoutes from "./routes/auth.routes"
import userRoutes from "./routes/user.routes"
import brandRoutes from "./routes/brand.routes"
import productRoutes from "./routes/product.routes"
import accessoryRoutes from "./routes/accessory.routes"
import sparePartRoutes from "./routes/sparePart.routes"

// Import error handler
import { errorHandler } from "./middlewares/error.middleware"

// Initialize express app
const app = express()

// Middlewares
app.use(cors())
app.use(helmet())
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

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" })
})

// Error handler
app.use(errorHandler)

// Connect to MongoDB
mongoose
  .connect(config.mongo.uri)
  .then(() => {
    console.log("Connected to MongoDB")

    // Start server
    const PORT = config.port
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err)
    process.exit(1)
  })

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.error("Unhandled Promise Rejection:", err)
  // Close server & exit process
  process.exit(1)
})

