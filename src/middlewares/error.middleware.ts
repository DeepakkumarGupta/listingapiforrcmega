import type { Request, Response, NextFunction } from "express"
import { ApiError } from "../utils/api-errors"

/**
 * Error handling middleware
 */
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(err)

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    })
    return
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    res.status(400).json({
      success: false,
      error: err.message,
    })
    return
  }

  // Mongoose duplicate key error
  if (err.name === "MongoError" && (err as any).code === 11000) {
    res.status(409).json({
      success: false,
      error: "Duplicate field value entered",
    })
    return
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    res.status(401).json({
      success: false,
      error: "Invalid token",
    })
    return
  }

  if (err.name === "TokenExpiredError") {
    res.status(401).json({
      success: false,
      error: "Token expired",
    })
    return
  }

  // Default to 500 server error
  res.status(500).json({
    success: false,
    error: "Server Error",
  })
}

