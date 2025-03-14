import mongoose, { type Document, Schema } from "mongoose"
import type { IBrandBase } from "../types/product.types"

export interface IBrand extends IBrandBase, Document {
  createdAt: Date
  updatedAt: Date
}

const BrandSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    logo: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

export default mongoose.model<IBrand>("Brand", BrandSchema)

