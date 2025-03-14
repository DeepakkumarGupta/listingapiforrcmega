import User, { type IUser } from "../models/user.model"
import { BadRequestError, NotFoundError, UnauthorizedError } from "../utils/api-errors"

export default class UserService {
  /**
   * Get all users (admin only) 
   */
  public static async getAllUsers(): Promise<IUser[]> {
    return await User.find().sort({ createdAt: -1 })
  }

  /**
   * Get user by ID
   */
  public static async getUserById(id: string): Promise<IUser> {
    const user = await User.findById(id)
    if (!user) {
      throw new NotFoundError(`User with id ${id} not found`)
    }
    return user
  }

  /**
   * Update user
   */
  public static async updateUser(id: string, userData: Partial<IUser>): Promise<IUser> {
    // Don't allow role updates through this method
    if (userData.role) {
      delete userData.role
    }

    // Don't allow password updates through this method
    if (userData.password) {
      delete userData.password
    }

    const user = await User.findById(id)
    if (!user) {
      throw new NotFoundError(`User with id ${id} not found`)
    }

    // If email is being updated, check if it already exists
    if (userData.email && userData.email !== user.email) {
      const existingUser = await User.findOne({ email: userData.email })
      if (existingUser) {
        throw new BadRequestError(`Email ${userData.email} is already in use`)
      }
    }

    Object.assign(user, userData)
    return await user.save()
  }

  /**
   * Update user password
   */
  public static async updatePassword(id: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await User.findById(id).select("+password")
    if (!user) {
      throw new NotFoundError(`User with id ${id} not found`)
    }

    // Check if current password matches
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      throw new UnauthorizedError("Current password is incorrect")
    }

    // Update password
    user.password = newPassword
    await user.save()
  }

  /**
   * Delete user (admin only)
   */
  public static async deleteUser(id: string): Promise<void> {
    const user = await User.findById(id)
    if (!user) {
      throw new NotFoundError(`User with id ${id} not found`)
    }

    await User.deleteOne({ _id: id })
  }
}

