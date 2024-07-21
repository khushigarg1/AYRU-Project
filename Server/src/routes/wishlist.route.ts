// routes/wishlistRoutes.ts
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
  getAllWishlists,
  addToWishlist,
  deleteWishlist,
  getWishlistByUserId,
} from "../Controllers/wishlist.controller";

export default async function WishlistRoutes(server: FastifyInstance) {
  server.get("/", { onRequest: [server?.authenticateAdmin] }, getAllWishlists);
  server.get(
    "/user/:userId",
    { onRequest: [server?.authenticateUser] },
    getWishlistByUserId
  );
  server.post(
    "/",
    { onRequest: [server?.authenticateUser] },
    (request, reply) => addToWishlist(server, request, reply)
  );
  server.delete(
    "/:wishlistId",
    { onRequest: [server?.authenticateUser] },
    deleteWishlist
  );
}
