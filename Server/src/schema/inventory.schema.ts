export interface InventoryAttributes {
  productName: string;
  skuId: string;
  categoryId?: number;
  subCategoryId?: number;
}
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
  discountCount?: number;
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
  threadCount?: number;
  itemWeight?: number;
  origin?: string;
  extraNote?: string;
  disclaimer?: string;
  careInstructions?: string[];
  categoryId?: number;
  subCategoryId?: number;
  flatIds?: number[];
  fittedIds?: {
    fittedId: number;
    fittedDimensions: number[];
  }[];
  customFittedIds?: number[];
  sizecharts?: {
    productId: number;
    selectedSizes: number[];
  }[];
  colorIds?: number[];
  relatedInventoriesIds?: number[];
  createdAt?: Date;
  updatedAt?: Date;
}
