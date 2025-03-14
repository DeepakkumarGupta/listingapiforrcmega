import type { Request, Response, NextFunction } from "express"
import UserService from "../services/user.service"
import { BadRequestError, ForbiddenError } from "../utils/api-errors"

export default class UserController {
  /**
   * Get all users (admin only)
   */
  public static async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Check if user is admin
      if (req.user.role !== "admin") {
        throw new ForbiddenError("Not authorized to access this route")
      }

      const users = await UserService.getAllUsers()

      res.status(200).json({
        success: true,
        count: users.length,
        data: users,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get user by ID
   */
  public static async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params

      // Check if user is admin or getting their own profile
      if (req.user.role !== "admin" && req.user.id !== id) {
        throw new ForbiddenError("Not authorized to access this route")
      }

      const user = await UserService.getUserById(id)

      res.status(200).json({
        success: true,
        data: user,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update user
   */
  public static async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params

      // Check if user is admin or updating their own profile
      if (req.user.role !== "admin" && req.user.id !== id) {
        throw new ForbiddenError("Not authorized to access this route")
      }

      const user = await UserService.updateUser(id, req.body)

      res.status(200).json({
        success: true,
        data: user,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update user password
   */
  public static async updatePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const { currentPassword, newPassword } = req.body

      // Check if user is updating their own password
      if (req.user.id !== id) {
        throw new ForbiddenError("Not authorized to access this route")
      }

      // Validate required fields
      if (!currentPassword || !newPassword) {
        throw new BadRequestError("Please provide current password and new password")
      }

      await UserService.updatePassword(id, currentPassword, newPassword)

      res.status(200).json({
        success: true,
        message: "Password updated successfully",
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Delete user (admin only)
   */
  public static async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params

      // Check if user is admin
      if (req.user.role !== "admin") {
        throw new ForbiddenError("Not authorized to access this route")
      }

      await UserService.deleteUser(id)

      res.status(200).json({
        success: true,
        data: {},
      })
    } catch (error) {
      next(error)
    }
  }
}

