import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ColorService } from "../Services/color.service";
import { ApiBadRequestError } from "../errors";

const colorServiceInstance = new ColorService();

interface AddColorRequest {
  Body: {
    name: string;
    colorCode: string;
  };
}

export async function addColor(
  server: FastifyInstance,
  request: FastifyRequest<AddColorRequest>,
  reply: FastifyReply
) {
  try {
    const { name, colorCode } = request.body;

    const color = await colorServiceInstance.addColor({
      name,
      colorCode,
    });

    reply.send({
      message: "Color created successfully",
      data: color,
    });
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}

export async function getColors(
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const colors = await colorServiceInstance.getColors();
    reply.send({
      message: "Colors retrieved successfully",
      data: colors,
    });
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}

export async function getColorById(
  server: FastifyInstance,
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const color = await colorServiceInstance.getColorById(Number(id));
    reply.send({ data: color });
  } catch (error) {
    reply.code(404).send({ message: (error as Error).message });
  }
}

export async function updateColor(
  server: FastifyInstance,
  request: FastifyRequest<AddColorRequest>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params as { id: string };
    const { name, colorCode } = request.body;

    const updatedColor = await colorServiceInstance.updateColor(Number(id), {
      name,
      colorCode,
    });

    reply.send({
      message: "Color updated successfully",
      data: updatedColor,
    });
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}

export async function deleteColor(
  server: FastifyInstance,
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const color = await colorServiceInstance.deleteColor(Number(id));
    reply.send({
      message: "Color deleted successfully",
      data: color,
    });
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}
