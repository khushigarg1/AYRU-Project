import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function updateConfig(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { masterpayment } = request.body as { masterpayment: boolean };

  try {
    let config;
    const existingConfig = await prisma.config.findUnique({
      where: { id: 1 },
    });

    if (existingConfig) {
      config = await prisma.config.update({
        where: { id: 1 },
        data: { masterpayment },
      });
    } else {
      config = await prisma.config.create({
        data: {
          id: 1,
          masterpayment,
        },
      });
    }

    return reply.status(200).send(config);
  } catch (error) {
    console.error("Error updating or creating config:", error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}
