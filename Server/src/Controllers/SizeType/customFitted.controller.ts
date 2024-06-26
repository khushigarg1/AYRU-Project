import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createcustomFitted = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { name } = request.body as {
    name: string;
    // inventoryIds: number[];
  };
  try {
    const customFitted = await prisma.customFitted.create({
      data: {
        name,
      },
    });
    reply.send({ data: customFitted });
  } catch (error) {
    reply.send(error);
  }
};

export const getCustomFitted = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const customFitted = await prisma.customFitted.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });
    reply.send({ data: customFitted });
  } catch (error) {
    reply.send(error);
  }
};

export const getcustomFittedById = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };
  try {
    const customFitted = await prisma.customFitted.findUnique({
      where: { id: Number(id) },
    });
    reply.send({ data: customFitted });
  } catch (error) {
    reply.send(error);
  }
};

export const updatecustomFitted = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };
  const { name, inventoryIds } = request.body as {
    name: string;
    inventoryIds: number[];
  };
  try {
    const customFitted = await prisma.customFitted.update({
      where: { id: Number(id) },
      data: {
        name,
      },
    });
    reply.send({ data: customFitted });
  } catch (error) {
    reply.send(error);
  }
};

export const deletecustomFitted = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };
  try {
    await prisma.customFitted.delete({
      where: { id: Number(id) },
    });
    reply.send({ message: "Custom Fitted Inventory deleted successfully" });
  } catch (error) {
    reply.send(error);
  }
};
