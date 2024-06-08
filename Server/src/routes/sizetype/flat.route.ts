import { FastifyInstance } from "fastify";
import {
  createFlat,
  getFlats,
  getFlatById,
  updateFlat,
  deleteFlat,
} from "../../Controllers/SizeType/flat.controller";

export default async function flatRoutes(server: FastifyInstance) {
  server.post("/", { onRequest: [server.authenticateAdmin] }, createFlat);
  server.get("/", getFlats);
  server.get("/:id", getFlatById);
  server.put("/:id", { onRequest: [server.authenticateAdmin] }, updateFlat);
  server.delete("/:id", { onRequest: [server.authenticateAdmin] }, deleteFlat);
}
