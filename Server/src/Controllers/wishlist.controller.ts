// controllers/wishlistController.ts
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";
import { WishlistService } from "../Services/wishlist.services";
const prisma = new PrismaClient();
const wishlistService = new WishlistService();

interface AddToWishlistRequest {
  Body: {
    userId: number;
    inventoryId: number;
  };
}

export async function addToWishlist(
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const wishlistItem = await wishlistService.addToWishlist(request.body);
    reply.code(201).send({ success: true, data: wishlistItem });
  } catch (error) {
    reply.code(500).send({ success: false, error: error });
  }
}
export async function getAllWishlists(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const wishlists = await prisma.wishlist.findMany();
    reply.code(200).send({ success: true, data: wishlists });
  } catch (error) {
    reply.code(500).send({ success: false, error: error });
  }
}

export async function getWishlistByUserId(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { userId } = request.params as any;

  try {
    const wishlists = await prisma.wishlist.findMany({
      where: {
        userId,
      },
    });
    reply.code(200).send({ success: true, data: wishlists });
  } catch (error) {
    reply.code(500).send({ success: false, error: error });
  }
}

export async function deleteWishlist(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { wishlistId } = request.params as any;

  try {
    await prisma.wishlist.delete({
      where: {
        id: wishlistId,
      },
    });
    reply
      .code(200)
      .send({ success: true, message: "Wishlist item deleted successfully" });
  } catch (error) {
    reply.code(500).send({ success: false, error: error });
  }
}

export async function countAllWishlists(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const count = await prisma.wishlist.count();
    reply.code(200).send({ success: true, count });
  } catch (error) {
    reply.code(500).send({ success: false, error: error });
  }
}
