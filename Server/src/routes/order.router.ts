import { FastifyInstance } from "fastify";
import {
  createOrder,
  getOrder,
  getOrders,
  updateOrder,
  deleteOrder,
} from "../Controllers/order.controller";

export default async function orderRoutes(server: FastifyInstance) {
  server.post("/", createOrder);
  server.get("/:id", getOrder);
  server.get("/", { onRequest: [server.authenticateAdmin] }, getOrders);
  server.put("/:id", updateOrder);
  server.delete("/:id", { onRequest: [server.authenticateAdmin] }, deleteOrder);
}
