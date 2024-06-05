import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createFitted = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { name, dimensions } = request.body as {
    name: string;
    dimensions: string[];
  };
  try {
    const fitted = await prisma.fitted.create({
      data: {
        name,
        FittedDimensions: {
          create: dimensions.map((dimension) => ({ dimensions: dimension })),
        },
      },
      include: { FittedDimensions: true },
    });
    reply.send(fitted);
  } catch (error) {
    reply.send(error);
  }
};

export const getFitteds = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const fitteds = await prisma.fitted.findMany({
      include: { FittedDimensions: true },
    });
    reply.send(fitteds);
  } catch (error) {
    reply.send(error);
  }
};

export const getFittedById = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };
  try {
    const fitted = await prisma.fitted.findUnique({
      where: { id: Number(id) },
      include: { FittedDimensions: true },
    });
    reply.send(fitted);
  } catch (error) {
    reply.send(error);
  }
};

export const updateFitted = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };
  const { name, dimensions } = request.body as {
    name: string;
    dimensions: string[];
  };
  try {
    await prisma.fittedDimensions.deleteMany({
      where: { fittedId: Number(id) },
    });
    const fitted = await prisma.fitted.update({
      where: { id: Number(id) },
      data: {
        name,
        FittedDimensions: {
          create: dimensions.map((dimension) => ({ dimensions: dimension })),
        },
      },
      include: { FittedDimensions: true },
    });
    reply.send(fitted);
  } catch (error) {
    reply.send(error);
  }
};

export const deleteFitted = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };
  try {
    const fitteddimension = await prisma.fittedDimensions.deleteMany({
      where: { fittedId: Number(id) },
    });
    const fitted = await prisma.fitted.delete({
      where: { id: Number(id) },
    });
    reply.send({
      message: "Fitted deleted successfully",
      data: { fitted, fitteddimension },
    });
  } catch (error) {
    reply.send(error);
  }
};
