// routes/customerSideDataRoutes.ts

import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getAllDashboardData } from "../Controllers/Dashboard.controller";

export default async function DashboardRoutes(server: FastifyInstance) {
  server.get("", (request, reply) => getAllDashboardData(request, reply));
}
