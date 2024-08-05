import fastify, { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import aauthMiddleware from "./middleware/auth";
import AuthRoutes from "./routes/userAuthRoute.routes";
// import multipart from "@fastify/multipart";
import fastifyJwt from "@fastify/jwt";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import path from "path";
import fs from "fs";
import { getImage } from "../config/awsfunction";
import registerRoutes from "./routes";
const fileUpload = require("fastify-file-upload");

const server = fastify({ logger: true });
const prisma = new PrismaClient();

server.register(fileUpload);

// const Razorpay = require("razorpay");

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

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
registerRoutes(server);

// const port = 8080;
// const host = "localhost";

// server.listen({ port, host }, (err, address) => {
//   if (err) {
//     server.log.error(err);
//     console.error(err);
//     process.exit(1);
//   }
//   console.log(`Server listening on ${address}`);
// });

const port = parseInt(process.env.PORT ?? "4000", 10);

server.listen({ port, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    server.log.error(err);
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening on ${address}`);
});
