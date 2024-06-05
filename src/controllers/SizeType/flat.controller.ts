import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createFlat = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { name, size } = request.body as { name: string; size: string };
  try {
    const flat = await prisma.flat.create({
      data: { name, size },
    });
    reply.send({ data: flat });
  } catch (error) {
    reply.send(error);
  }
};

export const getFlats = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const flats = await prisma.flat.findMany();
    reply.send({ data: flats });
  } catch (error) {
    reply.send(error);
  }
};

export const getFlatById = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };
  try {
    const flat = await prisma.flat.findUnique({
      where: { id: Number(id) },
    });
    reply.send({ data: flat });
  } catch (error) {
    reply.send(error);
  }
};

export const updateFlat = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };
  const { name, size } = request.body as { name: string; size: string };
  try {
    const flat = await prisma.flat.update({
      where: { id: Number(id) },
      data: { name, size },
    });
    reply.send({ data: flat });
  } catch (error) {
    reply.send(error);
  }
};

export const deleteFlat = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };
  try {
    const flat = await prisma.flat.delete({
      where: { id: Number(id) },
    });
    reply.send({ message: "Flat deleted successfully", data: flat });
  } catch (error) {
    reply.send(error);
  }
};
