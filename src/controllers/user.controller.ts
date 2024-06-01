import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
// import { changeAdminPassword } from "../services/auth.service";
import userService from "../Services/user.service";
// import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

export async function requestEmailChange(
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { newemail } = request.body as { newemail: string };
  try {
    const response = await userService.requestEmailChange(
      server,
      request,
      reply,
      newemail
    );
    reply.send(response);
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}

export async function confirmEmailChange(
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { token } = request.query as { token: string };
  if (!token) {
    return reply.code(400).send({ message: "Token is required" });
  }
  console.log("tokennn---", token);

  try {
    const secretKey = process.env.JWT_TOKEN_SECRET;
    const decoded = server.jwt.verify(token) as {
      id: number;
      email: string;
    };
    if (!decoded || !decoded.id || !decoded.email) {
      throw new Error("Invalid token or missing data");
    }

    await userService.editEmail(
      server,
      request,
      reply,
      decoded?.id,
      decoded.email
    );
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}
