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
  };

  try {
    const filterOptions: any = {};

    if (categoryId) {
      filterOptions.categoryId = Number(categoryId);
    }
    if (subCategoryId) {
      filterOptions.subCategoryId = Number(subCategoryId);
    }
    if (fabric) {
      filterOptions.fabric = { equals: fabric, mode: "insensitive" };
    }
    if (style) {
      filterOptions.style = { equals: style, mode: "insensitive" };
    }
    if (minPrice && maxPrice) {
      filterOptions.sellingPrice = {
        gte: parseFloat(minPrice),
        lte: parseFloat(maxPrice),
      };
    }

    const orderBy: any = {};
    if (sortBy) {
      orderBy[sortBy] = sortOrder === "desc" ? "desc" : "asc";
    }

    const inventories = await prisma.inventory.findMany({
      where: filterOptions,
      orderBy,
      include: {
        Category: true,
        InventorySubcategory: { include: { SubCategory: true } },
        Media: true,
        Wishlist: true,
        relatedInventories: true,
        relatedByInventories: true,
        SizeChartMedia: true,
        ColorVariations: { include: { Color: true } },
        InventoryFlat: {
          where: flatSize ? { Flat: { size: flatSize } } : undefined,
          include: { Flat: true },
        },
        customFittedInventory: {
          where: customFittedId
            ? { customFittedId: Number(customFittedId) }
            : undefined,
          include: { customFitted: true },
        },
        InventoryFitted: {
          where: fittedSize
            ? {
                fittedDimensions: { some: { dimensions: fittedSize } },
              }
            : undefined,
          include: {
            Fitted: true,
          },
        },
      },
    });

    reply.send({ data: inventories });
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
  const { searchQuery, categoryId, subCategoryId } = request.query as {
    searchQuery: string;
    categoryId?: string;
    subCategoryId?: string;
  };

  try {
    const whereClause: any = {
      OR: [
        { productName: { contains: searchQuery, mode: "insensitive" } },
        { colorVariation: { contains: searchQuery, mode: "insensitive" } },
        { fabric: { contains: searchQuery, mode: "insensitive" } },
        {
          category: {
            categoryName: { contains: searchQuery, mode: "insensitive" },
          },
        },
        {
          subCategory: {
            subcategoryName: { contains: searchQuery, mode: "insensitive" },
          },
        },
      ],
    };

    if (categoryId) {
      whereClause.AND = whereClause.AND || [];
      whereClause.AND.push({ categoryId: parseInt(categoryId) });
    }
    if (subCategoryId) {
      whereClause.AND = whereClause.AND || [];
      whereClause.AND.push({ subCategoryId: parseInt(subCategoryId) });
    }

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
        // customFittedInventory: { include: { customFitted: true } },
        InventoryFitted: {
          include: {
            Fitted: true,
          },
        },
      },
    });

    reply.send({ data: inventories });
  } catch (error) {
    reply
      .status(500)
      .send({ error: "Failed to search inventories", details: error });
  }
};
