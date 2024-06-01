import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";

export default async function authMiddleware(server: FastifyInstance) {
  // User Authentication Middleware
  server.decorate(
    "authenticateUser",
    async function (req: FastifyRequest, reply: FastifyReply) {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return reply
          .code(401)
          .send({ message: "Authorization header missing" });
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        return reply.code(401).send({ message: "Token not found" });
      }

      try {
        const secretKey = process.env.JWT_TOKEN_SECRET;
        if (!secretKey) {
          throw new Error("JWT secret key not configured");
        }

        const decoded = jwt.verify(token, secretKey) as {
          id: number;
          role: string;
        };
        if (decoded.role !== "user") {
          throw new Error("Access denied. Not a user.");
        }
        req.user = decoded; // Attach user details to the request
      } catch (err) {
        return reply.code(401).send({ message: (err as Error).message });
      }
    }
  );

  // Admin Authentication Middleware
  server.decorate(
    "authenticateAdmin",
    async function (req: FastifyRequest, reply: FastifyReply) {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return reply
          .code(401)
          .send({ message: "Authorization header missing" });
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        return reply.code(401).send({ message: "Token not found" });
      }

      try {
        const secretKey = process.env.JWT_TOKEN_SECRET;
        if (!secretKey) {
          throw new Error("JWT secret key not configured");
        }

        const decoded = jwt.verify(token, secretKey) as {
          id: number;
          role: string;
        };
        if (decoded.role !== "admin") {
          throw new Error("Access denied. Not an admin.");
        }
        req.user = decoded; // Attach user details to the request
      } catch (err) {
        return reply.code(401).send({ message: (err as Error).message });
      }
    }
  );

  // Routes to validate tokens
  server.get(
    "/validate/admin",
    { onRequest: [server.authenticateAdmin] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return request.user;
    }
  );

  server.get(
    "/validate/user",
    { onRequest: [server.authenticateUser] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return request.user;
    }
  );
}
