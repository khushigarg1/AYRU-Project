import { FastifyReply, FastifyRequest } from "fastify";
import FlatService from "../../Services/sizetype/flat.service";
import { ApiBadRequestError } from "../../errors";

const flatService = new FlatService();

export const createFlat = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { name, size } = request.body as { name: string; size: string };
  try {
    const flat = await flatService.createFlat({ name, size });
    reply.send({ data: flat });
  } catch (error) {
    if (error instanceof ApiBadRequestError) {
      reply.status(400).send({ error: error.message });
    } else {
      reply.status(500).send({ error: "Internal Server Error" });
    }
  }
};

export const getFlats = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const flats = await flatService.getFlats();
    reply.send({ data: flats });
  } catch (error) {
    reply.status(500).send({ error: "Internal Server Error" });
  }
};

export const getFlatById = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };
  try {
    const flat = await flatService.getFlatById(Number(id));
    reply.send({ data: flat });
  } catch (error) {
    if (error instanceof ApiBadRequestError) {
      reply.status(404).send({ error: error.message });
    } else {
      reply.status(500).send({ error: "Internal Server Error" });
    }
  }
};

export const updateFlat = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };
  const { name, size } = request.body as { name: string; size: string };
  try {
    const flat = await flatService.updateFlat(Number(id), { name, size });
    reply.send({ data: flat });
  } catch (error) {
    if (error instanceof ApiBadRequestError) {
      reply.status(400).send({ error: error.message });
    } else {
      reply.status(500).send({ error: "Internal Server Error" });
    }
  }
};

export const deleteFlat = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };
  try {
    const flat = await flatService.deleteFlat(Number(id));
    reply.send({ message: "Flat deleted successfully", data: flat });
  } catch (error) {
    if (error instanceof ApiBadRequestError) {
      reply.status(404).send({ error: error.message });
    } else {
      reply.status(500).send({ error: "Internal Server Error" });
    }
  }
};
