import mongoose, { type Document, Schema } from "mongoose"
import type { IProductBase } from "../types/product.types"

export interface IProduct extends IProductBase, Document {
  createdAt: Date
  updatedAt: Date
}

const MediaSchema: Schema = new Schema(
  {
    type: {
      type: String,
      enum: ["image", "video", "instagram"],
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  { _id: false },
)

const SocialLinksSchema: Schema = new Schema(
  {
    instagram: String,
    facebook: String,
    youtube: String,
  },
  { _id: false },
)

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      ref: "Brand",
    },
    color: {
      type: String,
      required: true,
    },
    modelCode: {
      type: String,
      required: true,
    },
    scale: {
      type: String,
      required: true,
    },
    OutOfStock: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    media: [MediaSchema],
    socialLinks: SocialLinksSchema,
    technicalSpecs: [String],
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

// Create index for faster queries
ProductSchema.index({ slug: 1 })
ProductSchema.index({ brand: 1 })

export default mongoose.model<IProduct>("Product", ProductSchema)


