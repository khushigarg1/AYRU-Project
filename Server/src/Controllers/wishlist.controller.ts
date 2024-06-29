// controllers/wishlistController.ts
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";
import { WishlistService } from "../Services/wishlist.service";
import { ApiUnauthorizedError } from "../errors";
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
    const { userId } = request.body as any;
    if (userId != request.user.id) {
      throw new ApiUnauthorizedError("Access denied for the requested user.");
    }
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
    const wishlists = await wishlistService.getAllWishlists();
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
  if (userId != request?.user?.id) {
    throw new ApiUnauthorizedError("Access denied for the requested user.");
  }

  try {
    const wishlists = await wishlistService.getWishlistByUserId(Number(userId));
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
    const wishlistItem = await wishlistService.getWishlistById(
      Number(wishlistId)
    );

    if (wishlistItem.userId !== request.user.id) {
      throw new ApiUnauthorizedError("Access denied for the requested user.");
    }

    await wishlistService.deleteWishlist(Number(wishlistId));

    reply
      .code(200)
      .send({ success: true, message: "Wishlist item deleted successfully" });
  } catch (error) {
    reply.code(500).send({ success: false, error: error });
  }
}
