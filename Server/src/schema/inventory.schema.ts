import { ProductStatus } from "@prisma/client";

export interface InventoryAttributes {
  productName: string;
  skuId: string;
  categoryId?: number;
  subCategoryIds: number[];
  sellingPrice: number;
  soldQuantity?: number;
  extraOptionOutOfStock?: boolean;
  quantity: number;
  productstatus?: ProductStatus;
  availability?: boolean;
}

type FlatId = {
  id: number;
  quantity: number;
  soldQuantity: number;
  minQuantity: number;
  maxQuantity: number;
  sellingPrice: number;
  costPrice: number;
  discountedPrice: number;
};

type FittedId = {
  id: number;
  quantity: number;
  soldQuantity: number;
  minQuantity: number;
  maxQuantity: number;
  sellingPrice: number;
  costPrice: number;
  discountedPrice: number;
};

type customFittedId = {
  id: number;
  // flatId: number;
  sellingPrice: number;
  costPrice: number;
  discountedPrice: number;
};

export interface InventoryUpdateAttributes {
  id?: number;
  productName: string;
  skuId: string;
  quantity?: number;
  soldQuantity?: number;
  minQuantity?: number;
  maxQuantity?: number;
  sellingPrice?: number;
  costPrice?: number;
  discountedPrice?: number;
  availability?: boolean;
  weight?: number;
  productstatus?: "DRAFT" | "PUBLISHED";
  status?: "PENDING" | "DISPATCHED" | "SOLD";
  style?: string;
  pattern?: string;
  fabric?: string;
  type?: string;
  size?: string;
  includedItems?: Record<string, any>;
  itemDimensions?: string[];
  colorVariation?: string;
  extraOptionOutOfStock?: boolean;
  specialFeatures?: Record<string, any>;
  threadCount?: string;
  origin?: string;
  extraNote?: string;
  disclaimer?: string;
  others?: string;
  others1?: string;
  careInstructions?: string[];
  categoryId?: number;
  subCategoryIds?: number[];
  flatIds?: FlatId[];
  fittedIds?: FittedId[];
  customFittedIds?: customFittedId[];
  colorIds?: number[];
  relatedInventoriesIds?: number[];
  createdAt?: Date;
  updatedAt?: Date;
}
