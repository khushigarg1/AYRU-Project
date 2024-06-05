import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";
import { InventoryAttributes } from "../schema/inventory.schema";
import { uploadImageToS3, uploadVideoToS3 } from "../../config/awsfunction";
import { InventoryService } from "../Services/inventory.service";
const inventoryService = new InventoryService();
const prisma = new PrismaClient();

export const createInventory = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const {
    productName,
    skuId,
    quantity,
    soldQuantity,
    minQuantity,
    maxQuantity,
    sellingPrice,
    costPrice,
    discountedPrice,
    discountCount,
    availability,
    weight,
    status,
    style,
    pattern,
    fabric,
    type,
    size,
    includedItems,
    itemDimensions,
    colorVariation,
    extraOptionOutOfStock,
    specialFeatures,
    threadCount,
    itemWeight,
    origin,
    extraNote,
    disclaimer,
    careInstructions,
    categoryId,
    subCategoryId,
    colors,
    flatIds,
    fittedIds,
    customFittedIds,
  } = request.body as InventoryAttributes;

  try {
    const inventory = await prisma.inventory.create({
      data: {
        productName,
        skuId,
        quantity,
        soldQuantity,
        minQuantity,
        maxQuantity,
        sellingPrice,
        costPrice,
        discountedPrice,
        discountCount,
        availability,
        weight,
        status,
        style,
        pattern,
        fabric,
        type,
        size,
        includedItems,
        itemDimensions,
        colorVariation,
        extraOptionOutOfStock,
        specialFeatures,
        threadCount,
        itemWeight,
        origin,
        extraNote,
        disclaimer,
        careInstructions,
        categoryId,
        subCategoryId,
        colors,
        InventoryFlat: {
          create: flatIds?.map((flatId) => ({ flatId })),
        },
        InventoryFitted: {
          create: fittedIds?.map((fittedId) => ({ fittedId })),
        },
        customFittedInventory: {
          create: customFittedIds?.map((customFittedId) => ({
            customFittedId,
          })),
        },
      },
      include: {
        InventoryFlat: { include: { Flat: true } },
        InventoryFitted: {
          include: {
            Fitted: {
              include: { FittedDimensions: true },
            },
          },
        },
        customFittedInventory: { include: { customFitted: true } },
        Media: true,
      },
    });
    reply.send({ data: inventory });
  } catch (error) {
    reply.send(error);
  }
};
export const getInventories = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const inventories = await prisma.inventory.findMany({
      include: {
        InventoryFlat: { include: { Flat: true } },
        InventoryFitted: {
          include: {
            Fitted: {
              include: { FittedDimensions: true },
            },
          },
        },
        customFittedInventory: { include: { customFitted: true } },
        Media: true,
      },
    });
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
    const inventory = await prisma.inventory.findUnique({
      where: { id: Number(id) },
      include: {
        InventoryFlat: { include: { Flat: true } },
        InventoryFitted: {
          include: {
            Fitted: {
              include: { FittedDimensions: true },
            },
          },
        },
        customFittedInventory: { include: { customFitted: true } },
        Media: true,
      },
    });
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
  const {
    productName,
    skuId,
    quantity,
    soldQuantity,
    minQuantity,
    maxQuantity,
    sellingPrice,
    costPrice,
    discountedPrice,
    discountCount,
    availability,
    weight,
    status,
    style,
    pattern,
    fabric,
    type,
    size,
    includedItems,
    itemDimensions,
    colorVariation,
    extraOptionOutOfStock,
    specialFeatures,
    threadCount,
    itemWeight,
    origin,
    extraNote,
    disclaimer,
    careInstructions,
    categoryId,
    subCategoryId,
    colors,
    flatIds,
    fittedIds,
    customFittedIds,
  } = request.body as InventoryAttributes;

  try {
    await prisma.inventoryFlat.deleteMany({
      where: { inventoryId: Number(id) },
    });
    await prisma.inventoryFitted.deleteMany({
      where: { inventoryId: Number(id) },
    });

    const inventory = await prisma.inventory.update({
      where: { id: Number(id) },
      data: {
        productName,
        skuId,
        quantity,
        soldQuantity,
        minQuantity,
        maxQuantity,
        sellingPrice,
        costPrice,
        discountedPrice,
        discountCount,
        availability,
        weight,
        status,
        style,
        pattern,
        fabric,
        type,
        size,
        includedItems,
        itemDimensions,
        colorVariation,
        extraOptionOutOfStock,
        specialFeatures,
        threadCount,
        itemWeight,
        origin,
        extraNote,
        disclaimer,
        careInstructions,
        categoryId,
        subCategoryId,
        colors,
        InventoryFlat: {
          deleteMany: { inventoryId: Number(id) },
          create: flatIds?.map((flatId) => ({ flatId })),
        },
        InventoryFitted: {
          deleteMany: { inventoryId: Number(id) },
          create: fittedIds?.map((fittedId) => ({ fittedId })),
        },
        customFittedInventory: {
          deleteMany: { inventoryId: Number(id) },
          create: customFittedIds?.map((customFittedId) => ({
            customFittedId,
          })),
        },
      },
      include: {
        InventoryFlat: { include: { Flat: true } },
        InventoryFitted: {
          include: {
            Fitted: {
              include: { FittedDimensions: true },
            },
          },
        },
        customFittedInventory: { include: { customFitted: true } },
        Media: true,
      },
    });
    reply.send(inventory);
  } catch (error) {
    reply.send(error);
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

      await inventoryService.deleteInventoryMedia(Number(id));
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
export const uploadMedia = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const data = request.body;
    const result = await inventoryService.uploadMedias(data);

    reply.send({ message: "ClientLove created successfully", data: result });
  } catch (error) {
    reply.status(500).send({ error: "Failed to upload media", details: error });
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
    reply.status(500).send({ error: "Failed to get media", details: error });
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
    reply.status(500).send({ error: "Failed to delete media", details: error });
  }
};
