// services/wishlistService.ts

import { PrismaClient } from "@prisma/client";
import { ApiBadRequestError } from "../errors";

const prisma = new PrismaClient();

export class WishlistService {
  async addToWishlist(data: any) {
    const { userId, inventoryId } = data;
    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId,
        inventoryId,
      },
    });
    return wishlistItem;
  }

  async getAllWishlists() {
    const wishlists = await prisma.wishlist.findMany();
    return wishlists;
  }

  async getWishlistByUserId(userId: number) {
    try {
      const wishlists = await prisma.wishlist.findMany({
        where: {
          userId,
        },
        include: {
          inventory: {
            include: {
              InventoryFlat: { include: { Flat: true } },
              customFittedInventory: { include: { customFitted: true } },
              InventoryFitted: {
                include: {
                  Fitted: {
                    include: { FittedDimensions: true },
                  },
                  fittedDimensions: true,
                },
              },
              ColorVariations: { include: { Color: true } },
              relatedInventories: true,
              relatedByInventories: true,
              Media: true,
              SizeChartMedia: true,
            },
          },
        },
      });
      return wishlists;
    } catch (error: any) {
      throw new ApiBadRequestError(error?.message);
    }
  }

  async deleteWishlist(wishlistId: number) {
    await prisma.wishlist.delete({
      where: {
        id: wishlistId,
      },
    });
  }

  async countAllWishlists() {
    const count = await prisma.wishlist.count();
    return count;
  }
}
