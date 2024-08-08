import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { updateConfig } from "../Controllers/config.controller";

export default async function configRoutes(server: FastifyInstance) {
  server.put("/", { onRequest: [server.authenticateAdmin] }, updateConfig);
}
