import type { Request, Response, NextFunction } from "express"
import User from "../models/user.model"
import { BadRequestError, UnauthorizedError, NotFoundError } from "../utils/api-errors"

export default class AuthController {
  /**
   * Register a new user
   */
  public static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, password } = req.body

      // Validate required fields
      if (!name || !email || !password) {
        throw new BadRequestError("Please provide name, email and password")
      }

      // Check if user with the same email already exists
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        throw new BadRequestError("Email already in use")
      }

      // Create new user
      const user = await User.create({ name, email, password })

      // Generate token
      const token = user.generateAuthToken()

      // Remove password from response
      const userObject = user.toObject()
      const { password: userPassword, ...userWithoutPassword } = userObject

      res.status(201).json({
        success: true,
        data: { user: userObject, token },
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Login user
   */
  public static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body

      // Validate required fields
      if (!email || !password) {
        throw new BadRequestError("Please provide email and password")
      }

      // Check if user exists
      const user = await User.findOne({ email }).select("+password")
      if (!user) {
        throw new UnauthorizedError("Invalid credentials")
      }

      // Check if user is active
      if (!user.isActive) {
        throw new UnauthorizedError("Your account has been deactivated")
      }

      // Check if password matches
      const isMatch = await user.comparePassword(password)
      if (!isMatch) {
        throw new UnauthorizedError("Invalid credentials")
      }

      // Generate token
      const token = user.generateAuthToken()

      // Remove password from response
      const userObject = user.toObject()
      const { password: userPassword, ...userWithoutPassword } = userObject

      res.status(200).json({
        success: true,
        data: { user: userObject, token },
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get current user
   */
  public static async getCurrentUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await User.findById(req.user.id)
      if (!user) {
        throw new NotFoundError("User not found")
      }

      res.status(200).json({
        success: true,
        data: user,
      })
    } catch (error) {
      next(error)
    }
  }
}

