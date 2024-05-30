import fastify, {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

export default async function authMiddleware(server: FastifyInstance) {
  // server.register(require("fastify-jwt"), {
  //   secret: "supersecret",
  // });

  // Authentication for users
  server.decorate(
    "authenticateUser",
    async function (req: FastifyRequest, reply: FastifyReply) {
      try {
        await req.jwtVerify();
        const { role } = req.user as { role: string };
        if (role !== "user") {
          throw new Error("Access denied. Not a user.");
        }
      } catch (err) {
        reply.send(err);
      }
    }
  );

  // Authentication for admin
  server.decorate(
    "authenticateAdmin",
    async function (req: FastifyRequest, reply: FastifyReply) {
      try {
        await req.jwtVerify();
        const { role } = req.user as { role: string };
        if (role !== "admin") {
          throw new Error("Access denied. Not an admin.");
        }
      } catch (err) {
        reply.send(err);
      }
    }
  );

  // Route to validate admin token
  server.get(
    "/validate/admin",
    { onRequest: [server.authenticateAdmin] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return request.user;
    }
  );

  // Route to validate user token
  server.get(
    "/validate/user",
    { onRequest: [server.authenticateUser] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return request.user;
    }
  );
}
