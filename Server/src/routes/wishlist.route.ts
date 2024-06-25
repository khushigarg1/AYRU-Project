// routes/wishlistRoutes.ts
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
  getAllWishlists,
  addToWishlist,
  deleteWishlist,
  getWishlistByUserId,
  countAllWishlists,
} from "../Controllers/wishlist.controller";

export default async function WishlistRoutes(server: FastifyInstance) {
  server.get("/", getAllWishlists);
  server.get("/user/:userId", getWishlistByUserId);
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
  server.get("/count", countAllWishlists);
}
