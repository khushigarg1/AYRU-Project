import fastify, { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import aauthMiddleware from "./middleware/auth";
import AuthRoutes from "./routes/userAuthRoute.routes";
// import multipart from "@fastify/multipart";
import fastifyJwt from "@fastify/jwt";
import cors from "@fastify/cors";
import AdminAuthRoutes from "./routes/adminAuth.route";
import CategoryRoutes from "./routes/category.route";
import SubCategoryRoutes from "./routes/subCategory.route";
import multipart from "@fastify/multipart";
import path from "path";
import fs from "fs";
import ClientLoveRoutes from "./routes/clientLove.route";
import { getImage } from "../config/awsfunction";
import flatRoutes from "./routes/sizetype/flat.route";
import fittedRoutes from "./routes/sizetype/fitted.route";
import customFittedRoutes from "./routes/sizetype/customFitted.route";
import inventoryRoutes from "./routes/inventory.route";
const fileUpload = require("fastify-file-upload");

const server = fastify({ logger: true });
const prisma = new PrismaClient();

server.register(fileUpload);
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

server.register(multipart);
server.register(require("@fastify/static"), {
  root: path.join(__dirname, "uploads"),
  prefix: "/uploads/",
});
server.register(cors, {});

//------------------------------routes plugin/register---------------
server.get("/", function (request, reply) {
  reply.send({ hello: "world" });
});
// server.post("/upload", async (request, reply) => uploadImage(request, reply));
// export default async function routes(server: FastifyInstance) {
server.get("/api/image/:imageUrl", getImage);
// }

server.register(AuthRoutes, { prefix: "/api/auth" });
server.register(AdminAuthRoutes, { prefix: "/api/auth/admin" });
server.register(CategoryRoutes, { prefix: "/api" });
server.register(SubCategoryRoutes, { prefix: "/api" });
server.register(ClientLoveRoutes, { prefix: "/api" });
server.register(flatRoutes, { prefix: "/api/flat" });
server.register(fittedRoutes, { prefix: "/api/fitted" });
server.register(customFittedRoutes, { prefix: "/api/csutomfitted" });
server.register(inventoryRoutes, { prefix: "/api/inventory" });

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
