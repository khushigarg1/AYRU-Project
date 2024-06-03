import { FastifyInstance } from "fastify";
import {
  addClientLove,
  deleteClientLove,
  getAllClientLoves,
  getClientLoveById,
  // getImage,
  updateClientLove,
} from "../Controllers/clientLove.controller";

export default async function ClientLoveRoutes(server: FastifyInstance) {
  server.post(
    "/clientLove",
    { onRequest: [server.authenticateAdmin] },
    (request, reply) => addClientLove(server, request, reply)
  );
  server.get("/clientLoves", (request, reply) =>
    getAllClientLoves(request, reply)
  );
  server.get("/clientLove/:id", (request, reply) =>
    getClientLoveById(request, reply)
  );
  server.put(
    "/clientLove/:id",
    { onRequest: [server.authenticateAdmin] },
    (request, reply) => updateClientLove(request, reply)
  );
  server.delete(
    "/clientLove/:id",
    { onRequest: [server.authenticateAdmin] },
    (request, reply) => deleteClientLove(request, reply)
  );
  // server.get("/images/:imageUrl", (request, reply) => getImage(request, reply));
}
