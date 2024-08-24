"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("./middleware/auth"));
// import multipart from "@fastify/multipart";
const jwt_1 = __importDefault(require("@fastify/jwt"));
const cors_1 = __importDefault(require("@fastify/cors"));
const multipart_1 = __importDefault(require("@fastify/multipart"));
const path_1 = __importDefault(require("path"));
const awsfunction_1 = require("../config/awsfunction");
const routes_1 = __importDefault(require("./routes"));
const fileUpload = require("fastify-file-upload");
const server = (0, fastify_1.default)({ logger: true });
const prisma = new client_1.PrismaClient();
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
server.register(jwt_1.default, {
    secret: jwtSecret,
});
// server.register(aauthMiddleware);
(0, auth_1.default)(server);
server.register(multipart_1.default);
server.register(require("@fastify/static"), {
    root: path_1.default.join(__dirname, "uploads"),
    prefix: "/uploads/",
});
server.register(cors_1.default, {});
//------------------------------routes plugin/register---------------
server.get("/", function (request, reply) {
    reply.send({ hello: "world" });
});
// server.post("/upload", async (request, reply) => uploadImage(request, reply));
// export default async function routes(server: FastifyInstance) {
server.get("/api/image/:imageUrl", awsfunction_1.getImage);
// }
(0, routes_1.default)(server);
server.listen(8080, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening on ${address}`);
});
// const port = parseInt(process.env.PORT ?? "4000", 10);
// server.listen({ port, host: "0.0.0.0" }, (err, address) => {
//   if (err) {
//     server.log.error(err);
//     console.error(err);
//     process.exit(1);
//   }
//   console.log(`Server listening on ${address}`);
// });
