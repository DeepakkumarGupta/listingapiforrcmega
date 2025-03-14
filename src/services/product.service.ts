import Product, { type IProduct } from "../models/product.model"
import Accessory from "../models/accessory.model"
import SparePart from "../models/sparePart.model"
import Brand from "../models/brand.model"
import { BadRequestError, NotFoundError } from "../utils/api-errors"
import { generateSlug } from "../utils/helpers"

export default class ProductService {
  /**
   * Create a new product
   */
  public static async createProduct(productData: Partial<IProduct>): Promise<IProduct> {
    try {
      // Check if brand exists
      const brand = await Brand.findOne({ name: productData.brand })
      if (!brand) {
        throw new BadRequestError(`Brand ${productData.brand} does not exist`)
      }

      // Generate slug if not provided
      if (!productData.slug) {
        if (productData.name) {
          productData.slug = generateSlug(productData.name)
        } else {
          throw new BadRequestError("Product name is required to generate slug")
        }
      }

      // Check if product with the same slug already exists
      const existingProduct = await Product.findOne({ slug: productData.slug })
      if (existingProduct) {
        throw new BadRequestError(`Product with slug ${productData.slug} already exists`)
      }

      const product = new Product(productData)
      return await product.save()
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error
      }
      if (error instanceof Error) {
        throw new BadRequestError(`Error creating product: ${error.message}`)
      }
      throw new BadRequestError("Error creating product")
    }
  }

  /**
   * Get all products
   */
  public static async getAllProducts(query: any = {}): Promise<IProduct[]> {
    const { brand, minPrice, maxPrice, outOfStock, ...rest } = query

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
      filter.OutOfStock = outOfStock === "true"
    }

    return await Product.find(filter).sort({ createdAt: -1 })
  }

  /**
   * Get product by ID
   */
  public static async getProductById(id: string): Promise<IProduct> {
    const product = await Product.findById(id)
    if (!product) {
      throw new NotFoundError(`Product with id ${id} not found`)
    }
    return product
  }

  /**
   * Get product by slug
   */
  public static async getProductBySlug(slug: string): Promise<IProduct> {
    const product = await Product.findOne({ slug })
    if (!product) {
      throw new NotFoundError(`Product with slug ${slug} not found`)
    }
    return product
  }

  /**
   * Get product with compatible spare parts
   */
  public static async getProductWithSpareParts(id: string): Promise<any> {
    const product = await this.getProductById(id)
    const compatibleSpareParts = await SparePart.find({ compatibleProductIds: id })

    return {
      ...product.toObject(),
      compatibleSpareParts,
    }
  }

  /**
   * Get product with compatible accessories
   */
  public static async getProductWithAccessories(id: string): Promise<any> {
    const product = await this.getProductById(id)
    const compatibleAccessories = await Accessory.find({ compatibleProductIds: id })

    return {
      ...product.toObject(),
      compatibleAccessories,
    }
  }

  /**
   * Get complete product info (with spare parts and accessories)
   */
  public static async getCompleteProductInfo(id: string): Promise<any> {
    const product = await this.getProductById(id)
    const compatibleSpareParts = await SparePart.find({ compatibleProductIds: id })
    const compatibleAccessories = await Accessory.find({ compatibleProductIds: id })

    return {
      ...product.toObject(),
      compatibleSpareParts,
      compatibleAccessories,
    }
  }

  /**
   * Update product
   */
  public static async updateProduct(id: string, productData: Partial<IProduct>): Promise<IProduct> {
    const product = await Product.findById(id)
    if (!product) {
      throw new NotFoundError(`Product with id ${id} not found`)
    }

    // If brand is being updated, check if it exists
    if (productData.brand && productData.brand !== product.brand) {
      const brand = await Brand.findOne({ name: productData.brand })
      if (!brand) {
        throw new BadRequestError(`Brand ${productData.brand} does not exist`)
      }
    }

    // If slug is being updated, check if it already exists
    if (productData.slug && productData.slug !== product.slug) {
      const existingProduct = await Product.findOne({ slug: productData.slug })
      if (existingProduct) {
        throw new BadRequestError(`Product with slug ${productData.slug} already exists`)
      }
    }

    Object.assign(product, productData)
    return await product.save()
  }

  /**
   * Delete product
   */
  public static async deleteProduct(id: string): Promise<void> {
    const product = await Product.findById(id)
    if (!product) {
      throw new NotFoundError(`Product with id ${id} not found`)
    }

    // Remove product from compatible products in accessories and spare parts
    await Accessory.updateMany({ compatibleProductIds: id }, { $pull: { compatibleProductIds: id } })

    await SparePart.updateMany({ compatibleProductIds: id }, { $pull: { compatibleProductIds: id } })

    await Product.deleteOne({ _id: id })
  }
}

