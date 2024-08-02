import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";
import {
  InventoryAttributes,
  InventoryUpdateAttributes,
} from "../../schema/inventory.schema";
import { InventoryService } from "../../Services/Inventory/inventory.service";
const inventoryService = new InventoryService();
const prisma = new PrismaClient();

export const createInventory = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const {
    productName,
    skuId,
    categoryId,
    subCategoryIds,
    quantity,
    soldQuantity,
    sellingPrice,
    availability,
    productstatus,
    extraOptionOutOfStock,
    sale,
  } = request.body as InventoryAttributes;

  try {
    const inventory = await inventoryService.createInventory({
      productName,
      skuId,
      categoryId,
      subCategoryIds,
      quantity,
      soldQuantity,
      sellingPrice,
      availability,
      productstatus,
      extraOptionOutOfStock,
      sale,
    });
    reply.status(201).send({ data: inventory });
  } catch (error) {
    reply.status(500).send({ message: (error as Error).message, error: error });
  }
};
export const getInventoriesByCategory = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { categoryId, subCategoryId } = request.query as {
    categoryId: string;
    subCategoryId?: string;
  };

  if (!categoryId) {
    reply.status(400).send({ error: "Category ID is required" });
    return;
  }

  try {
    const inventories = await inventoryService.getInventoriesByCategory(
      Number(categoryId),
      subCategoryId ? Number(subCategoryId) : undefined
    );
    reply.send({ data: inventories });
  } catch (error) {
    reply
      .status(500)
      .send({ error: "Failed to fetch inventories", details: error });
  }
};

export const getInventories = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const inventories = await inventoryService.getInventories();
    reply.send({ data: inventories });
  } catch (error) {
    reply.send(error);
  }
};

export const getInventoryById = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };
  console.log("heyyyy");
  try {
    const inventory = await inventoryService.getInventoryById(Number(id));
    reply.send({ data: inventory });
  } catch (error) {
    reply.send(error);
  }
};

export const updateInventory = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };
  const data = request.body as InventoryUpdateAttributes;

  try {
    const inventory = await inventoryService.updateInventory(Number(id), data);
    reply.send({ data: inventory });
  } catch (error) {
    reply.status(500).send({ message: (error as Error).message, error });
  }
};

export const deleteInventory = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };

  try {
    await prisma.$transaction(async (prisma) => {
      await prisma.inventoryFlat.deleteMany({
        where: { inventoryId: Number(id) },
      });
      await prisma.inventoryFitted.deleteMany({
        where: { inventoryId: Number(id) },
      });
      await prisma.customFittedInventory.deleteMany({
        where: { inventoryId: Number(id) },
      });
      // await prisma.productInventory.deleteMany({
      //   where: { inventoryId: Number(id) },
      // });
      await prisma.colorVariation.deleteMany({
        where: { inventoryId: Number(id) },
      });
      await inventoryService.deleteInventoryMedia(Number(id));
      await inventoryService.deleteSizeChartMedia(Number(id));
      await prisma.inventory.delete({
        where: { id: Number(id) },
      });
    });

    reply.send({
      message: "Inventory and related entries deleted successfully",
    });
  } catch (error) {
    reply
      .status(500)
      .send({ error: "Failed to delete inventory", details: error });
  }
};

//------------------------------------------------Media controllers for images and video----------------------
export const uploadMedia = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const data = request.body;
    const result = await inventoryService.uploadMedias(data);

    reply.send({ message: "ClientLove created successfully", data: result });
  } catch (error) {
    reply
      .status(500)
      .send({ message: "Failed to upload media", details: error });
  }
};
export const getallMedia = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params as any;
    const result = await inventoryService.getallMedia(Number(id));
    reply.send({ message: "data fetched successfully", data: result });
  } catch (error) {
    reply.status(500).send({ message: "Failed to get media", details: error });
  }
};
export const deleteMedia = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params as any;
    const result = await inventoryService.deleteMedia(Number(id));
    reply.send({ message: "deleted successfully", data: result });
  } catch (error) {
    reply
      .status(500)
      .send({ message: "Failed to delete media", details: error });
  }
};

/*-------------------------------For searchign and filtering inventories-----------------------*/
// Route for filtering inventory items
// export const filterInventory = async (
//   request: FastifyRequest,
//   reply: FastifyReply
// ) => {
//   const {
//     categoryId,
//     subCategoryId,
//     fabric,
//     style,
//     minPrice,
//     maxPrice,
//     sortBy,
//     sortOrder,
//   } = request.query as {
//     categoryId: string;
//     subCategoryId?: string;
//     fabric?: string;
//     style?: string;
//     minPrice?: string;
//     maxPrice?: string;
//     sortBy?: string;
//     sortOrder?: "asc" | "desc";
//   };

//   try {
//     const filterOptions: any = {};

//     if (categoryId) {
//       filterOptions.categoryId = Number(categoryId);
//     }
//     if (subCategoryId) {
//       filterOptions.subCategoryId = Number(subCategoryId);
//     }
//     if (fabric) {
//       filterOptions.fabric = { equals: fabric, mode: "insensitive" };
//     }
//     if (style) {
//       filterOptions.style = { equals: style, mode: "insensitive" };
//     }
//     if (minPrice && maxPrice) {
//       filterOptions.sellingPrice = {
//         gte: parseFloat(minPrice),
//         lte: parseFloat(maxPrice),
//       };
//     }
//     const orderBy: any = {};
//     if (sortBy) {
//       orderBy[sortBy] = sortOrder === "desc" ? "desc" : "asc";
//     }

//     const inventories = await prisma.inventory.findMany({
//       where: filterOptions,
//       orderBy,
//       include: {
//         category: true,
//         subCategory: true,
//         Media: true,
//         Wishlist: true,
//         relatedInventories: true,
//         relatedByInventories: true,
//         SizeChartMedia: true,
//         ColorVariations: { include: { Color: true } },
//         InventoryFlat: { include: { Flat: true } },
//         customFittedInventory: { include: { customFitted: true } },
//         InventoryFitted: {
//           include: {
//             Fitted: {
//               include: { FittedDimensions: true },
//             },
//             fittedDimensions: true,
//           },
//         },
//       },
//     });

//     reply.send({ data: inventories });
//   } catch (error) {
//     reply
//       .status(500)
//       .send({ error: "Failed to filter inventories", details: error });
//   }
// };

export const filterInventory = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const {
    categoryId,
    subCategoryId,
    fabric,
    style,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
    flatSize,
    fittedSize,
    customFittedId,
    sale,
  } = request.query as {
    categoryId?: string;
    subCategoryId?: string;
    fabric?: string;
    style?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    flatSize?: string;
    fittedSize?: string;
    customFittedId?: string;
    sale?: string;
  };

  try {
    const baseFilterOptions: any = {};

    if (categoryId) {
      baseFilterOptions.categoryId = Number(categoryId);
    }
    if (subCategoryId) {
      baseFilterOptions.subCategoryId = Number(subCategoryId);
    }
    if (sale === "true") {
      baseFilterOptions.sale = true;
    }

    const baseInventories = await prisma.inventory.findMany({
      where: baseFilterOptions,
      include: {
        Category: true,
        InventorySubcategory: { include: { SubCategory: true } },
      },
    });

    const filteredInventories = baseInventories.filter((inventory) => {
      let isValid = true;

      if (
        fabric &&
        inventory.fabric &&
        inventory.fabric.toLowerCase() !== fabric.toLowerCase()
      ) {
        isValid = false;
      }
      if (
        style &&
        inventory.style &&
        inventory.style.toLowerCase() !== style.toLowerCase()
      ) {
        isValid = false;
      }
      if (minPrice && maxPrice) {
        const sellingPrice = inventory.sellingPrice;
        if (
          sellingPrice &&
          (sellingPrice < parseFloat(minPrice) ||
            sellingPrice > parseFloat(maxPrice))
        ) {
          isValid = false;
        }
      }

      return isValid;
    });

    const sortedInventories = filteredInventories.sort((a, b) => {
      if (sortBy) {
        const order = sortOrder === "desc" ? -1 : 1;
        const aValue = a[sortBy as keyof typeof a];
        const bValue = b[sortBy as keyof typeof b];

        if (aValue == null || bValue == null) {
          return 0;
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return (aValue - bValue) * order;
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return aValue.localeCompare(bValue) * order;
        }

        if (aValue < bValue) return -1 * order;
        if (aValue > bValue) return 1 * order;
        return 0;
      }
      return 0;
    });

    reply.send({ data: sortedInventories });
  } catch (error) {
    reply
      .status(500)
      .send({ error: "Failed to filter inventories", details: error });
  }
};

// Route for searching inventory items
export const searchInventory = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  console.log("heyy1");
  const { searchQuery, categoryId, subCategoryId } = request.query as {
    searchQuery: string;
    categoryId?: string;
    subCategoryId?: string | string[];
  };
  console.log(searchQuery);

  try {
    // Initialize the whereClause
    const whereClause: any = {
      OR: [
        { productName: { contains: searchQuery, mode: "insensitive" } },
        { colorVariation: { contains: searchQuery, mode: "insensitive" } },
        { fabric: { contains: searchQuery, mode: "insensitive" } },
        {
          Category: {
            categoryName: { contains: searchQuery, mode: "insensitive" },
          },
        },
        {
          InventorySubcategory: {
            some: {
              SubCategory: {
                subcategoryName: { contains: searchQuery, mode: "insensitive" },
              },
            },
          },
        },
      ],
    };

    // Add categoryId filter
    if (categoryId) {
      whereClause.AND = whereClause.AND || [];
      whereClause.AND.push({ categoryId: parseInt(categoryId) });
    }

    // Handle subCategoryId as an array
    if (subCategoryId) {
      const subCategoryIds = Array.isArray(subCategoryId)
        ? subCategoryId.map((id) => parseInt(id))
        : [parseInt(subCategoryId)];
      whereClause.InventorySubcategory = {
        some: {
          subcategoryid: { in: subCategoryIds },
        },
      };
    }

    console.log("Where Clause:", JSON.stringify(whereClause, null, 2));

    // Query the database
    const inventories = await prisma.inventory.findMany({
      where: whereClause,
      include: {
        Category: true,
        InventorySubcategory: { include: { SubCategory: true } },
        Media: true,
        Wishlist: true,
        ColorVariations: { include: { Color: true } },
        relatedInventories: true,
        relatedByInventories: true,
        SizeChartMedia: true,
        InventoryFlat: { include: { Flat: true } },
        InventoryFitted: { include: { Fitted: true } },
      },
    });

    reply.send({ data: inventories });
  } catch (error) {
    console.error("Error in searchInventory:", error);
    reply
      .status(500)
      .send({ error: "Failed to search inventories", details: error });
  }
};
export const filterSaleItem = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const inventories = await prisma.inventory.findMany({
      where: {
        sale: true,
      },
      include: {
        Category: true,
        InventorySubcategory: { include: { SubCategory: true } },
        Media: true,
        Wishlist: true,
        ColorVariations: { include: { Color: true } },
        relatedInventories: true,
        relatedByInventories: true,
        SizeChartMedia: true,
        InventoryFlat: { include: { Flat: true } },
        InventoryFitted: { include: { Fitted: true } },
      },
    });

    reply.send({ data: inventories });
  } catch (error) {
    console.error("Error in filterSaleItems:", error);
    reply
      .status(500)
      .send({ error: "Failed to filter sale items", details: error });
  }
};
