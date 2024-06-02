import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ClientLoveService } from "../Services/clientLove.service";

const clientLoveService = new ClientLoveService();

export async function addClientLove(
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  console.log(request);

  try {
    const clientLove = await clientLoveService.addClientLove(
      request.body,
      request.files()
    );
    reply.send({
      message: "ClientLove created successfully",
      data: clientLove,
    });
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}

export async function getClientLoves(
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const clientLoves = await clientLoveService.getClientLoves();
    reply.send({
      message: "ClientLoves retrieved successfully",
      data: clientLoves,
    });
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}

export async function getClientLoveById(
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = request.params as any;
    const clientLove = await clientLoveService.getClientLoveById(Number(id));
    reply.send({ data: clientLove });
  } catch (error) {
    reply.code(404).send({ message: (error as Error).message });
  }
}

export async function updateClientLove(
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = request.params as any;
    const clientLove = await clientLoveService.updateClientLove(
      Number(id),
      request.body,
      request.files
    );
    reply.send({
      message: "ClientLove updated successfully",
      data: clientLove,
    });
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}

export async function deleteClientLove(
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = request.params as any;
    const clientLove = await clientLoveService.deleteClientLove(Number(id));
    reply.send({
      message: "ClientLove deleted successfully",
      data: clientLove,
    });
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}
