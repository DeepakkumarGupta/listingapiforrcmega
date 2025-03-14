import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import config from "../config"
import { UnauthorizedError } from "../utils/api-errors"

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user: {
        id: string
        role: string
      }
    }
  }
}

/**
 * Authentication middleware
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("Authentication required")
    }

    const token = authHeader.split(" ")[1]

    if (!token) {
      throw new UnauthorizedError("Authentication required")
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as { id: string; role: string }
      req.user = {
        id: decoded.id,
        role: decoded.role,
      }
      next()
    } catch (error) {
      throw new UnauthorizedError("Invalid token")
    }
  } catch (error) {
    next(error)
  }
}

