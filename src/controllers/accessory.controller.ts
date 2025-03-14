import type { Request, Response, NextFunction } from "express"
import AccessoryService from "../services/accessory.service"
import { BadRequestError } from "../utils/api-errors"

export default class AccessoryController {
  /**
   * Create a new accessory
   */
  public static async createAccessory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const accessoryData = req.body

      // Validate required fields
      const requiredFields = ["name", "sku", "price", "brand", "description", "weight", "categories"]
      for (const field of requiredFields) {
        if (!accessoryData[field]) {
          throw new BadRequestError(`${field} is required`)
        }
      }

      const accessory = await AccessoryService.createAccessory(accessoryData)

      res.status(201).json({
        success: true,
        data: accessory,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get all accessories
   */
  public static async getAllAccessories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const accessories = await AccessoryService.getAllAccessories(req.query)

      res.status(200).json({
        success: true,
        count: accessories.length,
        data: accessories,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get accessory by ID
   */
  public static async getAccessoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const accessory = await AccessoryService.getAccessoryById(id)

      res.status(200).json({
        success: true,
        data: accessory,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get accessory by slug
   */
  public static async getAccessoryBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params
      const accessory = await AccessoryService.getAccessoryBySlug(slug)

      res.status(200).json({
        success: true,
        data: accessory,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get accessories for product
   */
  public static async getAccessoriesForProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { productId } = req.params
      const accessories = await AccessoryService.getAccessoriesForProduct(productId)

      res.status(200).json({
        success: true,
        count: accessories.length,
        data: accessories,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update accessory
   */
  public static async updateAccessory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const accessoryData = req.body

      const accessory = await AccessoryService.updateAccessory(id, accessoryData)

      res.status(200).json({
        success: true,
        data: accessory,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Delete accessory
   */
  public static async deleteAccessory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      await AccessoryService.deleteAccessory(id)

      res.status(200).json({
        success: true,
        data: {},
      })
    } catch (error) {
      next(error)
    }
  }
}

