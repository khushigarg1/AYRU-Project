import { PrismaClient } from "@prisma/client";
import { ApiBadRequestError } from "../errors";

const prisma = new PrismaClient();

export class CategoryService {
  async addCategory(data: any) {
    const { categoryName, description, icon, visible } = data;
    if (!categoryName) {
      throw new ApiBadRequestError("Please provide category name");
    }
    const category = await prisma.category.create({
      data: { categoryName, description, icon, visible },
    });
    return category;
  }

  async getCategories() {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: true,
        Inventory: {
          include: {
            InventoryFlat: { include: { Flat: true } },
            customFittedInventory: { include: { InventoryFlat: true } },
            InventoryFitted: {
              include: {
                Fitted: true,
              },
            },
            // ProductInventory: {
            //   include: {
            //     product: {
            //       include: { sizes: true },
            //     },
            //     selectedSizes: true,
            //   },
            // },
            ColorVariations: { include: { Color: true } },
            relatedInventories: true,
            relatedByInventories: true,
            Media: true,
            SizeChartMedia: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    return categories;
  }

  async getCategoryById(id: number) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { subcategories: true, Inventory: true },
    });
    if (!category) {
      throw new ApiBadRequestError("Error: Category not found.");
    }
    return category;
  }

  async updateCategory(id: number, data: any) {
    const existCategory = await prisma.category.findFirst({
      where: { id },
    });
    if (!existCategory) {
      throw new ApiBadRequestError(
        "Category not present, please create category first"
      );
    }
    const { categoryName, description, icon, visible } = data;
    const category = await prisma.category.update({
      where: { id },
      data: { categoryName, description, icon, visible },
    });
    return category;
  }

  async deleteCategory(id: number, cascade: boolean = false) {
    const subcategories = await prisma.subCategory.findMany({
      where: { categoryId: id },
      orderBy: {
        updatedAt: "desc",
      },
    });

    if (subcategories.length > 0) {
      if (!cascade) {
        throw new ApiBadRequestError(
          "Please delete subcategories related to this category first"
        );
      } else {
        await prisma.subCategory.deleteMany({
          where: { categoryId: id },
        });
      }
    }

    const category = await prisma.category.delete({
      where: { id },
    });
    return category;
  }

  async getVisibleCategories() {
    const visibleCategories = await prisma.category.findMany({
      where: { visible: true },
      include: {
        subcategories: {
          where: { visible: true },
        },
        Inventory: {
          include: {
            InventoryFlat: { include: { Flat: true } },
            customFittedInventory: { include: { InventoryFlat: true } },
            InventoryFitted: {
              include: {
                Fitted: true,
              },
            },
            // ProductInventory: {
            //   include: {
            //     product: {
            //       include: { sizes: true },
            //     },
            //     selectedSizes: true,
            //   },
            // },
            ColorVariations: { include: { Color: true } },
            relatedInventories: true,
            relatedByInventories: true,
            Media: true,
            SizeChartMedia: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    return visibleCategories;
  }
}
