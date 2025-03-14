import type { Request, Response, NextFunction } from "express"
import Product from "../models/product.model"
import Accessory from "../models/accessory.model"
import SparePart from "../models/sparePart.model"
import Brand from "../models/brand.model"
import { BadRequestError, NotFoundError } from "../utils/api-errors"
import { generateSlug } from "../utils/helpers"

export default class ProductController {
  /**
   * Create a new product
   */
  public static async createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const productData = req.body

      // Validate required fields
      const requiredFields = ["name", "brand", "color", "modelCode", "scale", "price"]
      for (const field of requiredFields) {
        if (!productData[field]) {
          throw new BadRequestError(`${field} is required`)
        }
      }

      // Check if brand exists
      const brand = await Brand.findOne({ name: productData.brand })
      if (!brand) {
        throw new BadRequestError(`Brand ${productData.brand} does not exist`)
      }

      // Generate slug if not provided
      if (!productData.slug) {
        productData.slug = generateSlug(productData.name)
      }

      // Check if product with the same slug already exists
      const existingProduct = await Product.findOne({ slug: productData.slug })
      if (existingProduct) {
        throw new BadRequestError(`Product with slug ${productData.slug} already exists`)
      }

      const product = await Product.create(productData)

      res.status(201).json({
        success: true,
        data: product,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get all products
   */
  public static async getAllProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { brand, minPrice, maxPrice, outOfStock, ...rest } = req.query

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

      const products = await Product.find(filter).sort({ createdAt: -1 })

      res.status(200).json({
        success: true,
        count: products.length,
        data: products,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get product by ID
   */
  public static async getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const product = await Product.findById(id)

      if (!product) {
        throw new NotFoundError(`Product with id ${id} not found`)
      }

      res.status(200).json({
        success: true,
        data: product,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get product by slug
   */
  public static async getProductBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params
      const product = await Product.findOne({ slug })

      if (!product) {
        throw new NotFoundError(`Product with slug ${slug} not found`)
      }

      res.status(200).json({
        success: true,
        data: product,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get product with spare parts
   */
  public static async getProductWithSpareParts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const product = await Product.findById(id)

      if (!product) {
        throw new NotFoundError(`Product with id ${id} not found`)
      }

      const compatibleSpareParts = await SparePart.find({ compatibleProductIds: id })

      res.status(200).json({
        success: true,
        data: {
          ...product.toObject(),
          compatibleSpareParts,
        },
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get product with accessories
   */
  public static async getProductWithAccessories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const product = await Product.findById(id)

      if (!product) {
        throw new NotFoundError(`Product with id ${id} not found`)
      }

      const compatibleAccessories = await Accessory.find({ compatibleProductIds: id })

      res.status(200).json({
        success: true,
        data: {
          ...product.toObject(),
          compatibleAccessories,
        },
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get complete product info
   */
  public static async getCompleteProductInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const product = await Product.findById(id)

      if (!product) {
        throw new NotFoundError(`Product with id ${id} not found`)
      }

      const compatibleSpareParts = await SparePart.find({ compatibleProductIds: id })
      const compatibleAccessories = await Accessory.find({ compatibleProductIds: id })

      res.status(200).json({
        success: true,
        data: {
          ...product.toObject(),
          compatibleSpareParts,
          compatibleAccessories,
        },
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update product
   */
  public static async updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const productData = req.body

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
      await product.save()

      res.status(200).json({
        success: true,
        data: product,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Delete product
   */
  public static async deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const product = await Product.findById(id)

      if (!product) {
        throw new NotFoundError(`Product with id ${id} not found`)
      }

      // Remove product from compatible products in accessories and spare parts
      await Accessory.updateMany({ compatibleProductIds: id }, { $pull: { compatibleProductIds: id } })

      await SparePart.updateMany({ compatibleProductIds: id }, { $pull: { compatibleProductIds: id } })

      await Product.deleteOne({ _id: id })

      res.status(200).json({
        success: true,
        data: {},
      })
    } catch (error) {
      next(error)
    }
  }
}

