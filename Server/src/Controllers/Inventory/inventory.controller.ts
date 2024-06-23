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
  const { productName, skuId, categoryId, subCategoryId } =
    request.body as InventoryAttributes;

  try {
    const inventory = await inventoryService.createInventory({
      productName,
      skuId,
      categoryId,
      subCategoryId,
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
      await prisma.productInventory.deleteMany({
        where: { inventoryId: Number(id) },
      });
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
