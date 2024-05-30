import fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import aauthMiddleware from "./middleware/auth";
import AuthRoutes from "./routes/authRoute.routes";
// import multipart from "@fastify/multipart";

import cors from "@fastify/cors";
const server = fastify({ logger: true });
const prisma = new PrismaClient();

server.register(require("fastify-jwt"), {
  secret: process.env.JWT_TOKEN_SECRET,
});
// server.register(aauthMiddleware);
aauthMiddleware(server);
// server.register(multipart);
server.register(cors, {});
server.get("/", function (request, reply) {
  reply.send({ hello: "world" });
});
server.register(AuthRoutes, { prefix: "/api/auth" });

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
