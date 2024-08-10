"use strict";
// services/wishlistService.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistService = void 0;
const client_1 = require("@prisma/client");
const errors_1 = require("../errors");
const omitCostPrice_1 = require("../utils/omitCostPrice");
const prisma = new client_1.PrismaClient();
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
class WishlistService {
    addToWishlist(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, inventoryId } = data;
            if (!userId || !inventoryId) {
                throw new errors_1.ApiBadRequestError("please fill necessary fields");
            }
            const existingWishlistItem = yield prisma.wishlist.findFirst({
                where: {
                    userId: userId,
                    inventoryId: inventoryId,
                },
            });
            if (existingWishlistItem) {
                return { existingWishlistItem, addedAlready: true };
            }
            const wishlistItem = yield prisma.wishlist.create({
                data: {
                    userId,
                    inventoryId,
                },
            });
            return wishlistItem;
        });
    }
    getAllWishlists() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const wishlists = yield prisma.wishlist.findMany({
                    include: {
                        User: true,
                        Inventory: {
                            include: {
                                customFittedInventory: {
                                    include: { InventoryFlat: { include: { Flat: true } } },
                                },
                                InventoryFlat: { include: { Flat: true } },
                                InventorySubcategory: { include: { SubCategory: true } },
                                InventoryFitted: {
                                    include: {
                                        Fitted: true,
                                    },
                                },
                                Category: true,
                                Wishlist: true,
                                // ProductInventory: {
                                //   include: {
                                //     product: {
                                //       include: { sizes: true },
                                //     },
                                //     selectedSizes: true,
                                //   },
                                // },
                                ColorVariations: { include: { Color: true } },
                                relatedInventories: {
                                    include: {
                                        Media: true,
                                    },
                                },
                                relatedByInventories: {
                                    include: {
                                        Media: true,
                                    },
                                },
                                Media: true,
                                SizeChartMedia: true,
                            },
                        },
                    },
                    orderBy: {
                        updatedAt: "desc",
                    },
                });
                const totalWishlists = (_a = wishlists === null || wishlists === void 0 ? void 0 : wishlists.length) !== null && _a !== void 0 ? _a : 0;
                const categoryCounts = {};
                wishlists.forEach((wishlistItem) => {
                    const inventory = wishlistItem.inventory;
                    if (inventory && inventory.categoryId && inventory.category) {
                        const categoryId = inventory.categoryId;
                        const categoryName = inventory.category.categoryName;
                        if (categoryId in categoryCounts) {
                            categoryCounts[categoryId].count++;
                        }
                        else {
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
                const transformedWishlists = wishlists.map((wishlistItem) => {
                    var _a, _b;
                    return (Object.assign(Object.assign({}, wishlistItem), { categoryName: ((_b = (_a = wishlistItem.inventory) === null || _a === void 0 ? void 0 : _a.category) === null || _b === void 0 ? void 0 : _b.categoryName) || "Uncategorized" }));
                });
                return {
                    wishlists: transformedWishlists,
                    totalWishlists,
                    categoryCounts,
                    mostUsedCategoryId: maxCategoryId,
                    mostUsedCategoryCount: maxCategoryCount,
                };
            }
            catch (error) {
                throw new errors_1.ApiBadRequestError(error === null || error === void 0 ? void 0 : error.message);
            }
        });
    }
    getWishlistById(wishlistId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wishlistItem = yield prisma.wishlist.findUnique({
                    where: { id: wishlistId },
                });
                if (!wishlistItem) {
                    throw new errors_1.ApiBadRequestError("Wishlist item not found");
                }
                return wishlistItem;
            }
            catch (error) {
                throw new errors_1.ApiBadRequestError(error === null || error === void 0 ? void 0 : error.message);
            }
        });
    }
    getWishlistByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wishlists = yield prisma.wishlist.findMany({
                    where: {
                        userId,
                    },
                    include: {
                        User: true,
                        Inventory: {
                            include: {
                                customFittedInventory: {
                                    include: { InventoryFlat: { include: { Flat: true } } },
                                },
                                InventoryFlat: { include: { Flat: true } },
                                InventorySubcategory: { include: { SubCategory: true } },
                                InventoryFitted: {
                                    include: {
                                        Fitted: true,
                                    },
                                },
                                Category: true,
                                Wishlist: true,
                                // ProductInventory: {
                                //   include: {
                                //     product: {
                                //       include: { sizes: true },
                                //     },
                                //     selectedSizes: true,
                                //   },
                                // },
                                ColorVariations: { include: { Color: true } },
                                relatedInventories: {
                                    include: {
                                        Media: true,
                                    },
                                },
                                relatedByInventories: {
                                    include: {
                                        Media: true,
                                    },
                                },
                                Media: true,
                                SizeChartMedia: true,
                            },
                        },
                    },
                    orderBy: {
                        updatedAt: "desc",
                    },
                });
                const wishlist = yield (0, omitCostPrice_1.omitCostPrice)(wishlists);
                // return wishlists;
                return wishlist;
            }
            catch (error) {
                throw new errors_1.ApiBadRequestError(error === null || error === void 0 ? void 0 : error.message);
            }
        });
    }
    deleteWishlist(wishlistId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield prisma.wishlist.delete({
                    where: {
                        id: wishlistId,
                    },
                });
            }
            catch (error) {
                throw new errors_1.ApiBadRequestError(error === null || error === void 0 ? void 0 : error.message);
            }
        });
    }
}
exports.WishlistService = WishlistService;
