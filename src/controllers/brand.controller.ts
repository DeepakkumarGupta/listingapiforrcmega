import type { Request, Response, NextFunction } from "express"
import Brand from "../models/brand.model"
import { BadRequestError, NotFoundError } from "../utils/api-errors"

export default class BrandController {
  /**
   * Create a new brand
   */
  public static async createBrand(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, logo } = req.body

      if (!name || !logo) {
        throw new BadRequestError("Name and logo are required")
      }

      // Check if brand with the same name already exists
      const existingBrand = await Brand.findOne({ name })
      if (existingBrand) {
        throw new BadRequestError(`Brand with name ${name} already exists`)
      }

      const brand = await Brand.create({ name, logo })

      res.status(201).json({
        success: true,
        data: brand,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get all brands
   */
  public static async getAllBrands(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const brands = await Brand.find().sort({ name: 1 })

      res.status(200).json({
        success: true,
        count: brands.length,
        data: brands,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get brand by ID
   */
  public static async getBrandById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const brand = await Brand.findById(id)

      if (!brand) {
        throw new NotFoundError(`Brand with id ${id} not found`)
      }

      res.status(200).json({
        success: true,
        data: brand,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update brand
   */
  public static async updateBrand(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const { name, logo } = req.body

      const brand = await Brand.findById(id)
      if (!brand) {
        throw new NotFoundError(`Brand with id ${id} not found`)
      }

      // If name is being updated, check if it already exists
      if (name && name !== brand.name) {
        const existingBrand = await Brand.findOne({ name })
        if (existingBrand) {
          throw new BadRequestError(`Brand with name ${name} already exists`)
        }
      }

      brand.name = name || brand.name
      brand.logo = logo || brand.logo
      await brand.save()

      res.status(200).json({
        success: true,
        data: brand,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Delete brand
   */
  public static async deleteBrand(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const brand = await Brand.findById(id)

      if (!brand) {
        throw new NotFoundError(`Brand with id ${id} not found`)
      }

      await Brand.deleteOne({ _id: id })

      res.status(200).json({
        success: true,
        data: {},
      })
    } catch (error) {
      next(error)
    }
  }
}

