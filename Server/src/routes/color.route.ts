import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  addColor,
  deleteColor,
  getColors,
  getColorById,
  updateColor,
} from "../Controllers/color.controller";

export default async function colorRoutes(server: FastifyInstance) {
  server.post<{ Body: { name: string; colorCode: string } }>(
    "/",
    { onRequest: [server.authenticateAdmin] },
    (request, reply) => addColor(server, request, reply)
  );
  server.get("/", (request, reply) => getColors(server, request, reply));
  server.get<{ Params: { id: string } }>("/:id", (request, reply) =>
    getColorById(server, request, reply)
  );
  server.put<{
    Params: { id: string };
    Body: { name: string; colorCode: string };
  }>("/:id", { onRequest: [server.authenticateAdmin] }, (request, reply) =>
    updateColor(server, request, reply)
  );
  server.delete<{ Params: { id: string } }>(
    "/:id",
    { onRequest: [server.authenticateAdmin] },
    (request, reply) => deleteColor(server, request, reply)
  );
}
