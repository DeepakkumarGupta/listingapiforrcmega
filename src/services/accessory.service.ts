import Accessory, { type IAccessory } from "../models/accessory.model"
import Product from "../models/product.model"
import Brand from "../models/brand.model"
import { BadRequestError, NotFoundError } from "../utils/api-errors"
import { generateSlug, isValidObjectId } from "../utils/helpers"

export default class AccessoryService {
  /**
   * Create a new accessory
   */
  public static async createAccessory(accessoryData: any): Promise<IAccessory> {
    // Check if accessory with the same SKU already exists
    const existingAccessory = await Accessory.findOne({ sku: accessoryData.sku })
    if (existingAccessory) {
      throw new BadRequestError(`Accessory with SKU ${accessoryData.sku} already exists`)
    }

    // Check if brand exists
    const brand = await Brand.findOne({ name: accessoryData.brand })
    if (!brand) {
      throw new BadRequestError(`Brand ${accessoryData.brand} does not exist`)
    }

    // Generate slug if not provided
    if (!accessoryData.slug) {
      accessoryData.slug = generateSlug(accessoryData.name)
    }

    // Check if slug already exists
    const slugExists = await Accessory.findOne({ slug: accessoryData.slug })
    if (slugExists) {
      throw new BadRequestError(`Accessory with slug ${accessoryData.slug} already exists`)
    }

    // Validate compatible products if provided
    if (accessoryData.compatibleProductIds && accessoryData.compatibleProductIds.length > 0) {
      for (const productId of accessoryData.compatibleProductIds) {
        if (!isValidObjectId(productId)) {
          throw new BadRequestError(`Invalid product ID: ${productId}`)
        }

        const product = await Product.findById(productId)
        if (!product) {
          throw new BadRequestError(`Product with ID ${productId} not found`)
        }
      }
    }

    // Set stock status based on stock quantity
    if (accessoryData.stock > 0) {
      accessoryData.outOfStock = false
    }

    // Create accessory
    return await Accessory.create(accessoryData)
  }

  /**
   * Get all accessories with optional filtering
   */
  public static async getAllAccessories(query: any): Promise<IAccessory[]> {
    const { brand, minPrice, maxPrice, outOfStock, category, ...rest } = query

    const filter: any = { ...rest }

    if (brand) {
      filter.brand = brand
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {}
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice)
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice)
    }

    if (outOfStock !== undefined) {
      filter.outOfStock = outOfStock === "true"
    }

    if (category) {
      filter.categories = { $in: [category] }
    }

    return await Accessory.find(filter).sort({ createdAt: -1 })
  }

  /**
   * Get accessory by ID
   */
  public static async getAccessoryById(id: string): Promise<IAccessory> {
    if (!isValidObjectId(id)) {
      throw new BadRequestError(`Invalid accessory ID: ${id}`)
    }

    const accessory = await Accessory.findById(id)
    if (!accessory) {
      throw new NotFoundError(`Accessory with ID ${id} not found`)
    }

    return accessory
  }

  /**
   * Get accessory by slug
   */
  public static async getAccessoryBySlug(slug: string): Promise<IAccessory> {
    const accessory = await Accessory.findOne({ slug })
    if (!accessory) {
      throw new NotFoundError(`Accessory with slug ${slug} not found`)
    }

    return accessory
  }

  /**
   * Get accessories for product
   */
  public static async getAccessoriesForProduct(productId: string): Promise<IAccessory[]> {
    if (!isValidObjectId(productId)) {
      throw new BadRequestError(`Invalid product ID: ${productId}`)
    }

    // Check if product exists
    const product = await Product.findById(productId)
    if (!product) {
      throw new NotFoundError(`Product with ID ${productId} not found`)
    }

    return await Accessory.find({ compatibleProductIds: productId })
  }

  /**
   * Update accessory
   */
  public static async updateAccessory(id: string, accessoryData: any): Promise<IAccessory> {
    if (!isValidObjectId(id)) {
      throw new BadRequestError(`Invalid accessory ID: ${id}`)
    }

    const accessory = await Accessory.findById(id)
    if (!accessory) {
      throw new NotFoundError(`Accessory with ID ${id} not found`)
    }

    // If SKU is being updated, check if it already exists
    if (accessoryData.sku && accessoryData.sku !== accessory.sku) {
      const existingSku = await Accessory.findOne({ sku: accessoryData.sku })
      if (existingSku) {
        throw new BadRequestError(`Accessory with SKU ${accessoryData.sku} already exists`)
      }
    }

    // If brand is being updated, check if it exists
    if (accessoryData.brand && accessoryData.brand !== accessory.brand) {
      const brand = await Brand.findOne({ name: accessoryData.brand })
      if (!brand) {
        throw new BadRequestError(`Brand ${accessoryData.brand} does not exist`)
      }
    }

    // If slug is being updated, check if it already exists
    if (accessoryData.slug && accessoryData.slug !== accessory.slug) {
      const slugExists = await Accessory.findOne({ slug: accessoryData.slug })
      if (slugExists) {
        throw new BadRequestError(`Accessory with slug ${accessoryData.slug} already exists`)
      }
    }

    // If compatible products are being updated, validate them
    if (accessoryData.compatibleProductIds) {
      for (const productId of accessoryData.compatibleProductIds) {
        if (!isValidObjectId(productId)) {
          throw new BadRequestError(`Invalid product ID: ${productId}`)
        }

        const product = await Product.findById(productId)
        if (!product) {
          throw new BadRequestError(`Product with ID ${productId} not found`)
        }
      }
    }

    // Update stock status based on stock quantity if stock is provided
    if (accessoryData.stock !== undefined) {
      accessoryData.outOfStock = accessoryData.stock <= 0
    }

    // Update accessory
    Object.assign(accessory, accessoryData)
    await accessory.save()

    return accessory
  }

  /**
   * Delete accessory
   */
  public static async deleteAccessory(id: string): Promise<void> {
    if (!isValidObjectId(id)) {
      throw new BadRequestError(`Invalid accessory ID: ${id}`)
    }

    const accessory = await Accessory.findById(id)
    if (!accessory) {
      throw new NotFoundError(`Accessory with ID ${id} not found`)
    }

    await Accessory.deleteOne({ _id: id })
  }
}

