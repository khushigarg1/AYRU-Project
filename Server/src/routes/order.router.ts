import { FastifyInstance } from "fastify";
import {
  createOrder,
  getOrder,
  getOrders,
  updateOrder,
  deleteOrder,
  getOrderbyId,
  getOrderbyAdminId,
  razorPayWebhook,
  uploadOrderMedia,
} from "../Controllers/order.controller";

export default async function orderRoutes(server: FastifyInstance) {
  server.post("/webhook", razorPayWebhook);
  server.post("/", (request, reply) => {
    createOrder(server, request, reply);
  });
  server.get("/", { preHandler: [server.authenticateUser] }, getOrder);
  server.get("/:id", { preHandler: [server.authenticateUser] }, getOrderbyId);
  server.get(
    "/admin/:id",
    { preHandler: [server.authenticateAdmin] },
    getOrderbyAdminId
  );
  server.get("/all", { onRequest: [server.authenticateAdmin] }, getOrders);
  server.put("/:id", updateOrder);
  server.delete("/:id", { onRequest: [server.authenticateAdmin] }, deleteOrder);

  //--------------------upload media and all

  server.put(
    "/upload",
    { onRequest: [server.authenticateAdmin] },
    uploadOrderMedia
  );
}
