import { FastifyInstance } from "fastify";
import {
  createOrder,
  getOrder,
  getOrders,
  updateOrder,
  deleteOrder,
} from "../Controllers/order.controller";

async function orderRoutes(server: FastifyInstance) {
  server.post("/orders", createOrder);
  server.get("/orders/:id", getOrder);
  server.get("/orders", { onRequest: [server.authenticateAdmin] }, getOrders);
  server.put("/orders/:id", updateOrder);
  server.delete(
    "/orders/:id",
    { onRequest: [server.authenticateAdmin] },
    deleteOrder
  );
}
