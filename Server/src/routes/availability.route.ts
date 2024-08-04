import { FastifyInstance } from "fastify";
import {
  createAvailabilityRequest,
  updateAvailabilityRequest,
  getAvailabilityCheck,
  getAllAvailability,
  checkExpiredRequests,
  getAvailability,
} from "../Controllers/availability.controller";

export async function availabilityRoutes(server: FastifyInstance) {
  server.post(
    "/",
    { preHandler: [server.authenticateUser] },
    createAvailabilityRequest
  );
  server.get(
    "/:id",
    { preHandler: [server.authenticateUser] },
    getAvailabilityCheck
  );
  server.get(
    "/single/:id",
    { preHandler: [server.authenticateAdmin] },
    getAvailability
  );
  server.get(
    "/all",
    { preHandler: [server.authenticateAdmin] },
    getAllAvailability
  );
  server.put(
    "/:id",
    { preHandler: [server.authenticateAdmin] },
    updateAvailabilityRequest
  );

  server.get("/check-expired", async (request, reply) => {
    return checkExpiredRequests(request, reply);
  });
}
