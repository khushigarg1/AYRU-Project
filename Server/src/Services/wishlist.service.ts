// services/wishlistService.ts

import { PrismaClient } from "@prisma/client";
import { ApiBadRequestError } from "../errors";

const prisma = new PrismaClient();

// async getAllWishlists() {
//     try {
//       // Get all users
//       const users = await prisma.user.findMany();

//       // Get all wishlists ordered by updatedAt descending
//       const wishlists = await prisma.wishlist.findMany({
//         include: {
//           inventory: {
//             include: {
//               InventoryFlat: { include: { Flat: true } },
//               customFittedInventory: { include: { customFitted: true } },
//               InventoryFitted: {
//                 include: {
//                   Fitted: {
//                     include: { FittedDimensions: true },
//                   },
//                   fittedDimensions: true,
//                 },
//               },
//               ColorVariations: { include: { Color: true } },
//               relatedInventories: true,
//               relatedByInventories: true,
//               Media: true,
//               SizeChartMedia: true,
//             },
//           },
//         },
//         orderBy: {
//           updatedAt: 'desc', // Order by updatedAt in descending order
//         },
//       });

//       // Merge users with their wishlists
//       const result = users.map(user => ({
//         ...user,
//         wishlists: wishlists.filter(wishlist => wishlist.userId === user.id),
//       }));

//       return result;
//     } catch (error: any) {
//       throw new ApiBadRequestError(error?.message);
//     }
//   }
export class WishlistService {
  async addToWishlist(data: any) {
    const { userId, inventoryId } = data;

    if (!userId || !inventoryId) {
      throw new ApiBadRequestError("please fill necessary fields");
    }
    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId,
        inventoryId,
      },
    });
    return wishlistItem;
  }

  async getAllWishlists() {
    try {
      const wishlists = await prisma.wishlist.findMany({
        include: {
          user: true,
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
              category: true,
              subCategory: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      const totalWishlists = wishlists?.length ?? 0;
      const categoryCounts: Record<
        number,
        { id: number; name: string; count: number }
      > = {};

      wishlists.forEach((wishlistItem: any) => {
        const inventory = wishlistItem.inventory;
        if (inventory && inventory.categoryId && inventory.category) {
          const categoryId = inventory.categoryId;
          const categoryName = inventory.category.categoryName;
          if (categoryId in categoryCounts) {
            categoryCounts[categoryId].count++;
          } else {
            categoryCounts[categoryId] = {
              id: categoryId,
              name: categoryName,
              count: 1,
            };
          }
        }
      });

      let maxCategoryCount = 0;
      let maxCategoryId = 0;

      for (const categoryId in categoryCounts) {
        if (categoryCounts[categoryId].count > maxCategoryCount) {
          maxCategoryCount = categoryCounts[categoryId].count;
          maxCategoryId = categoryCounts[categoryId].id;
        }
      }

      const transformedWishlists = wishlists.map((wishlistItem: any) => ({
        ...wishlistItem,
        categoryName:
          wishlistItem.inventory?.category?.categoryName || "Uncategorized",
      }));

      return {
        wishlists: transformedWishlists,
        totalWishlists,
        categoryCounts,
        mostUsedCategoryId: maxCategoryId,
        mostUsedCategoryCount: maxCategoryCount,
      };
    } catch (error: any) {
      throw new ApiBadRequestError(error?.message);
    }
  }

  async getWishlistById(wishlistId: number) {
    try {
      const wishlistItem = await prisma.wishlist.findUnique({
        where: { id: wishlistId },
      });
      if (!wishlistItem) {
        throw new ApiBadRequestError("Wishlist item not found");
      }

      return wishlistItem;
    } catch (error: any) {
      throw new ApiBadRequestError(error?.message);
    }
  }

  async getWishlistByUserId(userId: number) {
    try {
      const wishlists = await prisma.wishlist.findMany({
        where: {
          userId,
        },
        include: {
          user: true,
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
        orderBy: {
          updatedAt: "desc",
        },
      });
      return wishlists;
    } catch (error: any) {
      throw new ApiBadRequestError(error?.message);
    }
  }
}
