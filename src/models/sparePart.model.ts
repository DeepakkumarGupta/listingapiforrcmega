import mongoose, { type Document, Schema } from "mongoose"
import type { ISparePartBase } from "../types/product.types"

export interface ISparePart extends ISparePartBase, Document {
  createdAt: Date
  updatedAt: Date
}

const DimensionsSchema: Schema = new Schema(
  {
    length: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      enum: ["mm", "cm", "in"],
      required: true,
    },
  },
  { _id: false },
)

const MediaSchema: Schema = new Schema(
  {
    type: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  { _id: false },
)

const SparePartSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    outOfStock: {
      type: Boolean,
      default: true,
    },
    categories: {
      type: [String],
      required: true,
    },
    compatibleProductIds: {
      type: [{ type: Schema.Types.ObjectId, ref: "Product" }],
      default: [],
    },
    brand: {
      type: String,
      required: true,
      ref: "Brand",
    },
    description: {
      type: String,
      required: true,
    },
    media: [MediaSchema],
    weight: {
      type: Number,
      required: true,
    },
    dimensions: DimensionsSchema,
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

// Create index for faster queries
SparePartSchema.index({ slug: 1 })
SparePartSchema.index({ sku: 1 })
SparePartSchema.index({ brand: 1 })
SparePartSchema.index({ compatibleProductIds: 1 })

export default mongoose.model<ISparePart>("SparePart", SparePartSchema)

