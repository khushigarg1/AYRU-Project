import { FastifyReply, FastifyRequest } from "fastify";
import FittedService from "../../Services/sizetype/fitted.service";
import { ApiBadRequestError } from "../../errors";

const fittedService = new FittedService();

export const createFitted = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { name, dimensions } = request.body as {
    name: string;
    dimensions: string[];
  };
  try {
    const fitted = await fittedService.createFitted({ name, dimensions });
    reply.send({ data: fitted });
  } catch (error) {
    if (error instanceof ApiBadRequestError) {
      reply.status(400).send({ error: error.message });
    } else {
      reply.status(500).send({ error: "Internal Server Error" });
    }
  }
};

export const getFitteds = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const fitteds = await fittedService.getFitteds();
    reply.send({ data: fitteds });
  } catch (error) {
    reply.status(500).send({ error: "Internal Server Error" });
  }
};

export const getFittedById = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };
  try {
    const fitted = await fittedService.getFittedById(Number(id));
    reply.send({ data: fitted });
  } catch (error) {
    if (error instanceof ApiBadRequestError) {
      reply.status(404).send({ error: error.message });
    } else {
      reply.status(500).send({ error: "Internal Server Error" });
    }
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
    const fitted = await fittedService.updateFitted(Number(id), {
      name,
      dimensions,
    });
    reply.send({ data: fitted });
  } catch (error) {
    if (error instanceof ApiBadRequestError) {
      reply.status(400).send({ error: error.message });
    } else {
      reply.status(500).send({ error: "Internal Server Error" });
    }
  }
};

export const deleteFitted = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };
  try {
    const fitted = await fittedService.deleteFitted(Number(id));
    reply.send({ message: "Fitted deleted successfully", data: fitted });
  } catch (error) {
    if (error instanceof ApiBadRequestError) {
      reply.status(404).send({ error: error.message });
    } else {
      reply.status(500).send({ error: "Internal Server Error" });
    }
  }
};
