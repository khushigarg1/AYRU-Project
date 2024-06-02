import { FastifyInstance } from "fastify";
import {
  addClientLove,
  deleteClientLove,
  getClientLoves,
  getClientLoveById,
  updateClientLove,
} from "../Controllers/clientLove.controller";

export default async function ClientLoveRoutes(server: FastifyInstance) {
  server.post(
    "/clientLove",
    { onRequest: [server.authenticateAdmin] },
    (request, reply) => addClientLove(server, request, reply)
  );
  server.get("/clientLoves", (request, reply) =>
    getClientLoves(server, request, reply)
  );
  server.get("/clientLove/:id", (request, reply) =>
    getClientLoveById(server, request, reply)
  );
  server.put(
    "/clientLove/:id",
    { onRequest: [server.authenticateAdmin] },
    (request, reply) => updateClientLove(server, request, reply)
  );
  server.delete(
    "/clientLove/:id",
    { onRequest: [server.authenticateAdmin] },
    (request, reply) => deleteClientLove(server, request, reply)
  );
}
