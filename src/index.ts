import fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import aauthMiddleware from "./middleware/auth";
import AuthRoutes from "./routes/userAuthRoute.routes";
// import multipart from "@fastify/multipart";
import fastifyJwt from "@fastify/jwt";
import cors from "@fastify/cors";
import AdminAuthRoutes from "./routes/adminAuth.route";

const server = fastify({ logger: true });
const prisma = new PrismaClient();

// Check if JWT_TOKEN_SECRET is defined
const jwtSecret = process.env.JWT_TOKEN_SECRET;
if (!jwtSecret) {
  console.error("JWT_TOKEN_SECRET is not defined");
  process.exit(1);
}

// Register the fastify-jwt plugin
server.register(fastifyJwt, {
  secret: jwtSecret,
});

// server.register(aauthMiddleware);
aauthMiddleware(server);
// server.register(multipart);
server.register(cors, {});
server.get("/", function (request, reply) {
  reply.send({ hello: "world" });
});
server.register(AuthRoutes, { prefix: "/api/auth" });
server.register(AdminAuthRoutes, { prefix: "/api/auth/admin" });

server.listen(3000, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening on ${address}`);
});

// const start = async () => {
//   try {
//     await server.listen({ port: process.env.PORT, host: "0.0.0.0" });
//   } catch (err) {
//     // console.log(err);
//     server.log.error(err);
//     // process.exit(1)
//   }
// };
// start();
