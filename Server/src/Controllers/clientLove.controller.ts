import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ClientLoveService } from "../Services/clientLove.service";
import fs from "fs";
import path from "path";
const clientLoveService = new ClientLoveService();

export async function addClientLove(
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const clientLove = await clientLoveService.addClientLove(request.body);
    reply.send({
      message: "ClientLove created successfully",
      data: clientLove,
    });
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}

export async function getAllClientLoves(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const clientLoves = await clientLoveService.getAllClientLoves();
    reply.send({ data: clientLoves });
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}

export async function getClientLoveById(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as any;
  try {
    const clientLove = await clientLoveService.getClientLoveById(Number(id));
    if (!clientLove) {
      reply.code(404).send({ message: "ClientLove not found" });
    } else {
      reply.send({ data: clientLove });
    }
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}

export async function updateClientLove(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as any;
  try {
    const clientLove = await clientLoveService.updateClientLove(
      Number(id),
      request.body
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
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as any;
  try {
    await clientLoveService.deleteClientLove(Number(id));
    reply.send({ message: "ClientLove deleted successfully" });
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}

// export async function getImage(request: FastifyRequest, reply: FastifyReply) {
//   const { imageUrl } = request.params as any;
//   const imagePath = path.join(__dirname, "../uploads/images", imageUrl);
//   console.log("imagepath-----------", imagePath);

//   if (fs.existsSync(imagePath)) {
//     const imageData = fs.readFileSync(imagePath);
//     reply.header("Content-Type", "image/jpeg");
//     reply.send(imageData);
//   } else {
//     reply.code(404).send({ message: "Image not found" });
//   }
// }
