import Brand, { type IBrand } from "../models/brand.model"
import { BadRequestError, NotFoundError } from "../utils/api-errors"

export default class BrandService {
  /**
   * Create a new brand
   */
  public static async createBrand(brandData: Partial<IBrand>): Promise<IBrand> {
    try {
      // Check if brand with the same name already exists
      const existingBrand = await Brand.findOne({ name: brandData.name })
      if (existingBrand) {
        throw new BadRequestError(`Brand with name ${brandData.name} already exists`)
      }

      const brand = new Brand(brandData)
      return await brand.save()
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error
      }
      if (error instanceof Error) {
        throw new BadRequestError(`Error creating brand: ${error.message}`)
      }
      throw new BadRequestError('Error creating brand')
    }
  }

  /**
   * Get all brands
   */
  public static async getAllBrands(): Promise<IBrand[]> {
    return await Brand.find().sort({ name: 1 })
  }

  /**
   * Get brand by ID
   */
  public static async getBrandById(id: string): Promise<IBrand> {
    const brand = await Brand.findById(id)
    if (!brand) {
      throw new NotFoundError(`Brand with id ${id} not found`)
    }
    return brand
  }

  /**
   * Update brand
   */
  public static async updateBrand(id: string, brandData: Partial<IBrand>): Promise<IBrand> {
    const brand = await Brand.findById(id)
    if (!brand) {
      throw new NotFoundError(`Brand with id ${id} not found`)
    }

    // If name is being updated, check if it already exists
    if (brandData.name && brandData.name !== brand.name) {
      const existingBrand = await Brand.findOne({ name: brandData.name })
      if (existingBrand) {
        throw new BadRequestError(`Brand with name ${brandData.name} already exists`)
      }
    }

    Object.assign(brand, brandData)
    return await brand.save()
  }

  /**
   * Delete brand
   */
  public static async deleteBrand(id: string): Promise<void> {
    const brand = await Brand.findById(id)
    if (!brand) {
      throw new NotFoundError(`Brand with id ${id} not found`)
    }

    await Brand.deleteOne({ _id: id })
  }
}

