import SparePart, { type ISparePart } from "../models/sparePart.model"
import Product from "../models/product.model"
import Brand from "../models/brand.model"
import { BadRequestError, NotFoundError } from "../utils/api-errors"
import { generateSlug } from "../utils/helpers"

export default class SparePartService {
  /**
   * Create a new spare part
   */
  public static async createSparePart(sparePartData: Partial<ISparePart>): Promise<ISparePart> {
    try {
      // Check if brand exists
      const brand = await Brand.findOne({ name: sparePartData.brand })
      if (!brand) {
        throw new BadRequestError(`Brand ${sparePartData.brand} does not exist`)
      }

      // Generate slug if not provided
      if (!sparePartData.slug) {
        sparePartData.slug = generateSlug(sparePartData.name!)
      }

      // Check if spare part with the same slug or SKU already exists
      const existingSparePart = await SparePart.findOne({
        $or: [{ slug: sparePartData.slug }, { sku: sparePartData.sku }],
      })

      if (existingSparePart) {
        if (existingSparePart.slug === sparePartData.slug) {
          throw new BadRequestError(`Spare part with slug ${sparePartData.slug} already exists`)
        } else {
          throw new BadRequestError(`Spare part with SKU ${sparePartData.sku} already exists`)
        }
      }

      // Validate compatible products
      if (sparePartData.compatibleProductIds && sparePartData.compatibleProductIds.length > 0) {
        for (const productId of sparePartData.compatibleProductIds) {
          const product = await Product.findById(productId)
          if (!product) {
            throw new BadRequestError(`Product with id ${productId} does not exist`)
          }
        }
      }

      // Set outOfStock based on stock
      if (sparePartData.stock !== undefined) {
        sparePartData.outOfStock = sparePartData.stock <= 0
      }

      const sparePart = new SparePart(sparePartData)
      return await sparePart.save()
    } catch (error: any) {
      if (error instanceof BadRequestError) {
        throw error
      }
      throw new BadRequestError(`Error creating spare part: ${error.message}`)
    }
  }

  /**
   * Get all spare parts
   */
  public static async getAllSpareParts(query: any = {}): Promise<ISparePart[]> {
    const { brand, category, compatibleWith, minPrice, maxPrice, inStock, ...rest } = query

    const filter: any = { ...rest }

    if (brand) {
      filter.brand = brand
    }

    if (category) {
      filter.categories = { $in: [category] }
    }

    if (compatibleWith) {
      filter.compatibleProductIds = compatibleWith
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {}
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice)
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice)
    }

    if (inStock !== undefined) {
      filter.outOfStock = inStock === "true" ? false : true
    }

    return await SparePart.find(filter).sort({ createdAt: -1 })
  }

  /**
   * Get spare part by ID
   */
  public static async getSparePartById(id: string): Promise<ISparePart> {
    const sparePart = await SparePart.findById(id)
    if (!sparePart) {
      throw new NotFoundError(`Spare part with id ${id} not found`)
    }
    return sparePart
  }

  /**
   * Get spare part by slug
   */
  public static async getSparePartBySlug(slug: string): Promise<ISparePart> {
    const sparePart = await SparePart.findOne({ slug })
    if (!sparePart) {
      throw new NotFoundError(`Spare part with slug ${slug} not found`)
    }
    return sparePart
  }

  /**
   * Get spare parts for a specific product
   */
  public static async getSparePartsForProduct(productId: string): Promise<ISparePart[]> {
    // Verify product exists
    const product = await Product.findById(productId)
    if (!product) {
      throw new NotFoundError(`Product with id ${productId} not found`)
    }

    return await SparePart.find({ compatibleProductIds: productId })
  }

  /**
   * Update spare part
   */
  public static async updateSparePart(id: string, sparePartData: Partial<ISparePart>): Promise<ISparePart> {
    const sparePart = await SparePart.findById(id)
    if (!sparePart) {
      throw new NotFoundError(`Spare part with id ${id} not found`)
    }

    // If brand is being updated, check if it exists
    if (sparePartData.brand && sparePartData.brand !== sparePart.brand) {
      const brand = await Brand.findOne({ name: sparePartData.brand })
      if (!brand) {
        throw new BadRequestError(`Brand ${sparePartData.brand} does not exist`)
      }
    }

    // If slug is being updated, check if it already exists
    if (sparePartData.slug && sparePartData.slug !== sparePart.slug) {
      const existingSparePart = await SparePart.findOne({ slug: sparePartData.slug })
      if (existingSparePart) {
        throw new BadRequestError(`Spare part with slug ${sparePartData.slug} already exists`)
      }
    }

    // If SKU is being updated, check if it already exists
    if (sparePartData.sku && sparePartData.sku !== sparePart.sku) {
      const existingSparePart = await SparePart.findOne({ sku: sparePartData.sku })
      if (existingSparePart) {
        throw new BadRequestError(`Spare part with SKU ${sparePartData.sku} already exists`)
      }
    }

    // Validate compatible products
    if (sparePartData.compatibleProductIds && sparePartData.compatibleProductIds.length > 0) {
      for (const productId of sparePartData.compatibleProductIds) {
        const product = await Product.findById(productId)
        if (!product) {
          throw new BadRequestError(`Product with id ${productId} does not exist`)
        }
      }
    }

    // Update outOfStock based on stock if stock is provided
    if (sparePartData.stock !== undefined) {
      sparePartData.outOfStock = sparePartData.stock <= 0
    }

    Object.assign(sparePart, sparePartData)
    return await sparePart.save()
  }

  /**
   * Delete spare part
   */
  public static async deleteSparePart(id: string): Promise<void> {
    const sparePart = await SparePart.findById(id)
    if (!sparePart) {
      throw new NotFoundError(`Spare part with id ${id} not found`)
    }

    await SparePart.deleteOne({ _id: id })
  }
}

