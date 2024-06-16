import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";
import { InventoryAttributes } from "../../schema/inventory.schema";
import { InventoryService } from "../../Services/Inventory/inventory.service";
const inventoryService = new InventoryService();
const prisma = new PrismaClient();

//------------------------------------------------MEdia controllers for images and video----------------------
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
