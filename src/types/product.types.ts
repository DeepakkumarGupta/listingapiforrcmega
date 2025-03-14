export interface IMedia {
  type: "image" | "video" | "instagram"
  url: string
}

export interface ISocialLinks {
  instagram?: string
  facebook?: string
  youtube?: string
}

export interface IProductBase {
  name: string
  brand: string
  color: string
  modelCode: string
  scale: string
  OutOfStock: boolean
  price: number
  slug: string
  media: IMedia[]
  socialLinks: ISocialLinks
  technicalSpecs: string[]
}

export interface IDimensions {
  length: number
  width: number
  height: number
  unit: "mm" | "cm" | "in"
}

export interface IAccessoryBase {
  name: string
  slug: string
  sku: string
  price: number
  stock: number
  outOfStock: boolean
  categories: string[]
  compatibleProductIds: string[]
  brand: string
  description: string
  media: IMedia[]
  weight: number
  dimensions?: IDimensions
}

export interface ISparePartBase {
  name: string
  slug: string
  sku: string
  price: number
  stock: number
  outOfStock: boolean
  categories: string[]
  compatibleProductIds: string[]
  brand: string
  description: string
  media: IMedia[]
  weight: number
  dimensions?: IDimensions
}

export interface IBrandBase {
  name: string
  logo: string
}

