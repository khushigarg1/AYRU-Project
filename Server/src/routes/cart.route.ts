// routes/cartRoutes.ts
import { FastifyInstance } from "fastify";
import {
  addToCart,
  removeFromCart,
  updateCart,
  getCart,
  getAllCart,
} from "../Controllers/cart.controller";

export default async function CartRoutes(server: FastifyInstance) {
  server.post("/", { preHandler: [server.authenticateUser] }, addToCart);
  server.put(
    "/:cartItemId",
    { preHandler: [server.authenticateUser] },
    updateCart
  );
  server.delete(
    "/:cartItemId",
    { preHandler: [server.authenticateUser] },
    removeFromCart
  );
  server.get("/user", { preHandler: [server.authenticateUser] }, getCart);
  server.get("/", { preHandler: [server.authenticateAdmin] }, getAllCart);
}
