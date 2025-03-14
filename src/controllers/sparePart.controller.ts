import type { Request, Response, NextFunction } from "express"
import SparePartService from "../services/sparePart.service"
import { BadRequestError } from "../utils/api-errors"

export default class SparePartController {
  /**
   * Create a new spare part
   */
  public static async createSparePart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sparePartData = req.body

      // Validate required fields
      const requiredFields = ["name", "sku", "price", "brand", "description", "weight", "categories"]
      for (const field of requiredFields) {
        if (!sparePartData[field]) {
          throw new BadRequestError(`${field} is required`)
        }
      }

      const sparePart = await SparePartService.createSparePart(sparePartData)

      res.status(201).json({
        success: true,
        data: sparePart,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get all spare parts
   */
  public static async getAllSpareParts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const spareParts = await SparePartService.getAllSpareParts(req.query)

      res.status(200).json({
        success: true,
        count: spareParts.length,
        data: spareParts,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get spare part by ID
   */
  public static async getSparePartById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const sparePart = await SparePartService.getSparePartById(id)

      res.status(200).json({
        success: true,
        data: sparePart,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get spare part by slug
   */
  public static async getSparePartBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params
      const sparePart = await SparePartService.getSparePartBySlug(slug)

      res.status(200).json({
        success: true,
        data: sparePart,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get spare parts for product
   */
  public static async getSparePartsForProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { productId } = req.params
      const spareParts = await SparePartService.getSparePartsForProduct(productId)

      res.status(200).json({
        success: true,
        count: spareParts.length,
        data: spareParts,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update spare part
   */
  public static async updateSparePart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const sparePartData = req.body

      const sparePart = await SparePartService.updateSparePart(id, sparePartData)

      res.status(200).json({
        success: true,
        data: sparePart,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Delete spare part
   */
  public static async deleteSparePart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      await SparePartService.deleteSparePart(id)

      res.status(200).json({
        success: true,
        data: {},
      })
    } catch (error) {
      next(error)
    }
  }
}

