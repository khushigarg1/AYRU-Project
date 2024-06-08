import { FastifyInstance } from "fastify";
import {
  createFitted,
  getFitteds,
  getFittedById,
  updateFitted,
  deleteFitted,
} from "../../Controllers/SizeType/fitted.controller";

export default async function fittedRoutes(server: FastifyInstance) {
  server.post("/", { onRequest: [server.authenticateAdmin] }, createFitted);
  server.get("/", getFitteds);
  server.get("/:id", getFittedById);
  server.put("/:id", { onRequest: [server.authenticateAdmin] }, updateFitted);
  server.delete(
    "/:id",
    { onRequest: [server.authenticateAdmin] },
    deleteFitted
  );
}
