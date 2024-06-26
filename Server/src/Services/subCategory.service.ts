import { PrismaClient } from "@prisma/client";
import { ApiBadRequestError } from "../errors";

const prisma = new PrismaClient();

export class SubCategoryService {
  async addSubCategory(data: any) {
    const { subcategoryName, categoryId, description, icon, visible } = data;
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!existingCategory) {
      throw new ApiBadRequestError("Please create category first");
    }
    if (!subcategoryName || !categoryId) {
      throw new ApiBadRequestError(
        "Please provide subcategory name and category ID"
      );
    }
    const subCategory = await prisma.subCategory.create({
      data: { subcategoryName, categoryId, description, icon, visible },
    });
    return subCategory;
  }

  async getSubCategories() {
    const subCategories = await prisma.subCategory.findMany({
      include: { category: true, Inventory: true },
      orderBy: {
        updatedAt: "desc",
      },
    });
    return subCategories;
  }

  async getSubCategoryById(id: number) {
    const subCategory = await prisma.subCategory.findUnique({
      where: { id },
      include: { category: true, Inventory: true },
    });
    if (!subCategory) {
      throw new ApiBadRequestError("Error: SubCategory not found.");
    }
    return subCategory;
  }

  async updateSubCategory(id: number, data: any) {
    const existSubCategory = await prisma.subCategory.findFirst({
      where: { id },
    });
    if (!existSubCategory) {
      throw new ApiBadRequestError(
        "SubCategory not present, please create subcategory first"
      );
    }
    const { subcategoryName, categoryId, description, icon, visible } = data;
    const subCategory = await prisma.subCategory.update({
      where: { id },
      data: { subcategoryName, categoryId, description, icon, visible },
    });
    return subCategory;
  }

  async deleteSubCategory(id: number) {
    const subCategory = await prisma.subCategory.delete({
      where: { id },
    });
    return subCategory;
  }
}
