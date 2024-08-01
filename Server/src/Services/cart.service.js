"use strict";
// // services/CartService.ts
// import { PrismaClient } from "@prisma/client";
// import { ApiBadRequestError, Api404Error } from "../errors";
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
exports.CartService = void 0;
// const prisma = new PrismaClient();
// export class CartService {
//   async addToCart(
//     userId: number,
//     inventoryId: number,
//     quantity: number,
//     sizeType?: string,
//     sizeName?: string,
//     length?: number,
//     width?: number,
//     height?: number,
//     remark?: string
//   ) {
//     try {
//       const cartItem = await prisma.cart.create({
//         data: {
//           userId,
//           inventoryId,
//           quantity,
//           sizeType,
//           sizeName,
//           length,
//           width,
//           height,
//           remark,
//         },
//       });
//       return cartItem;
//     } catch (error: any) {
//       throw new ApiBadRequestError(error.message);
//     }
//   }
//   async removeFromCart(userId: number, cartItemId: number) {
//     const cartItem = await prisma.cart.delete({
//       where: {
//         id: cartItemId,
//         userId,
//       },
//     });
//     if (!cartItem) {
//       throw new Api404Error("Cart item not found");
//     }
//   }
//   async updateCart(
//     userId: number,
//     cartItemId: number,
//     quantity: number,
//     sizeType?: string,
//     sizeName?: string,
//     length?: number,
//     width?: number,
//     height?: number,
//     remark?: string
//   ) {
//     try {
//       const updatedCartItem = await prisma.cart.update({
//         where: {
//           id: cartItemId,
//           userId,
//         },
//         data: {
//           quantity,
//           sizeType,
//           sizeName,
//           length,
//           width,
//           height,
//           remark,
//         },
//       });
//       return updatedCartItem;
//     } catch (error: any) {
//       throw new ApiBadRequestError(error);
//     }
//   }
//   async getUserCart(userId: number) {
//     const userCart = await prisma.cart.findMany({
//       where: {
//         userId,
//       },
//       include: {
//         User: true,
//         Inventory: {
//           include: {
//             customFittedInventory: { include: { InventoryFlat: true } },
//             InventoryFlat: { include: { Flat: true } },
//             InventorySubcategory: { include: { SubCategory: true } },
//             InventoryFitted: {
//               include: {
//                 Fitted: true,
//               },
//             },
//             Category: true,
//             Wishlist: true,
//             // ProductInventory: {
//             //   include: {
//             //     product: {
//             //       include: { sizes: true },
//             //     },
//             //     selectedSizes: true,
//             //   },
//             // },
//             ColorVariations: { include: { Color: true } },
//             relatedInventories: {
//               include: {
//                 Media: true,
//               },
//             },
//             relatedByInventories: {
//               include: {
//                 Media: true,
//               },
//             },
//             Media: true,
//             SizeChartMedia: true,
//           },
//         },
//       },
//       orderBy: {
//         updatedAt: "desc",
//       },
//     });
//     let totalPrice = 0;
//     const populatedUserCart = userCart.map((cartItem) => {
//       const inventory = cartItem.Inventory;
//       if (
//         inventory &&
//         inventory.discountedPrice !== null &&
//         inventory.discountedPrice !== undefined
//       ) {
//         totalPrice += inventory.discountedPrice;
//       } else if (
//         inventory &&
//         inventory.costPrice !== null &&
//         inventory.costPrice !== undefined &&
//         (inventory.discountedPrice == null ||
//           inventory.discountedPrice == undefined)
//       ) {
//         totalPrice += inventory.costPrice;
//       }
//     });
//     return { userCart, totalPrice: totalPrice };
//   }
//   // async getAllCart() {
//   //   const userCart = await prisma.cart.findMany({
//   //     include: {
//   //       user: true,
//   //       inventory: {
//   //         include: {
//   //           InventoryFlat: { include: { Flat: true } },
//   //           customFittedInventory: { include: { customFitted: true } },
//   //           InventoryFitted: {
//   //             include: {
//   //               Fitted: {
//   //                 include: { FittedDimensions: true },
//   //               },
//   //               fittedDimensions: true,
//   //             },
//   //           },
//   //           ColorVariations: { include: { Color: true } },
//   //           relatedInventories: true,
//   //           relatedByInventories: true,
//   //           Media: true,
//   //           SizeChartMedia: true,
//   //         },
//   //       },
//   //     },
//   //     orderBy: {
//   //       updatedAt: "desc",
//   //     },
//   //   });
//   //   return userCart;
//   // }
//   async getAllCart() {
//     const userCart = await prisma.cart.findMany({
//       include: {
//         User: true,
//         Inventory: {
//           include: {
//             customFittedInventory: { include: { InventoryFlat: true } },
//             InventoryFlat: { include: { Flat: true } },
//             InventorySubcategory: { include: { SubCategory: true } },
//             InventoryFitted: {
//               include: {
//                 Fitted: true,
//               },
//             },
//             Category: true,
//             Wishlist: true,
//             // ProductInventory: {
//             //   include: {
//             //     product: {
//             //       include: { sizes: true },
//             //     },
//             //     selectedSizes: true,
//             //   },
//             // },
//             ColorVariations: { include: { Color: true } },
//             relatedInventories: {
//               include: {
//                 Media: true,
//               },
//             },
//             relatedByInventories: {
//               include: {
//                 Media: true,
//               },
//             },
//             Media: true,
//             SizeChartMedia: true,
//           },
//         },
//       },
//       orderBy: {
//         updatedAt: "desc",
//       },
//     });
//     // Calculate total number of products and count by category
//     let totalProducts = 0;
//     const categoryCounts: Record<number, number> = {};
//     userCart.forEach((cartItem) => {
//       const inventory = cartItem.Inventory;
//       if (inventory) {
//         totalProducts++;
//         // Counting category occurrences
//         const categoryId = inventory.categoryId;
//         if (categoryId) {
//           if (categoryCounts[categoryId]) {
//             categoryCounts[categoryId]++;
//           } else {
//             categoryCounts[categoryId] = 1;
//           }
//         }
//       }
//     });
//     let maxCategoryCount = 0;
//     let maxCategoryName = "";
//     for (const categoryId in categoryCounts) {
//       if (categoryCounts[categoryId] > maxCategoryCount) {
//         maxCategoryCount = categoryCounts[categoryId];
//         maxCategoryName = `Category ID: ${categoryId}`;
//       }
//     }
//     return {
//       userCart,
//       totalProducts,
//       categoryCounts,
//       maxCategoryName,
//       maxCategoryCount,
//     };
//   }
// }
// services/CartService.ts
const client_1 = require("@prisma/client");
const errors_1 = require("../errors");
const prisma = new client_1.PrismaClient();
class CartService {
    addToCart(userId, inventoryId, quantity, flatId, fittedId, customId, sellingPrice, costPrice, discountedPrice, sizeOption, selectedFlatItem, selectedFittedItem, selectedCustomFittedItem, unit, length, width, height, remark) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find an existing cart item
                let existingCartItem;
                let cartsizeItem;
                // Find an existing cart item based on sizeOption
                if (sizeOption === "flat") {
                    existingCartItem = yield prisma.cart.findFirst({
                        where: {
                            userId,
                            inventoryId,
                            flatId,
                        },
                    });
                    cartsizeItem = yield prisma.inventoryFlat.findFirst({
                        where: {
                            inventoryId,
                            flatId,
                        },
                    });
                }
                else if (sizeOption === "fitted") {
                    existingCartItem = yield prisma.cart.findFirst({
                        where: {
                            userId,
                            inventoryId,
                            fittedId,
                        },
                    });
                    cartsizeItem = yield prisma.inventoryFitted.findFirst({
                        where: {
                            inventoryId,
                            fittedId,
                        },
                    });
                }
                else if (sizeOption === "custom") {
                    existingCartItem = yield prisma.cart.findFirst({
                        where: {
                            userId,
                            inventoryId,
                            customId,
                            length,
                            width,
                            height,
                            unit,
                        },
                    });
                    const customfitted = yield prisma.customFittedInventory.findFirst({
                        where: {
                            id: customId,
                        },
                    });
                    if (customfitted === null || customfitted === void 0 ? void 0 : customfitted.inventoryFlatId) {
                        const flatinventoryitem = yield prisma.inventoryFlat.findFirst({
                            where: {
                                inventoryId,
                                id: customfitted === null || customfitted === void 0 ? void 0 : customfitted.inventoryFlatId,
                            },
                        });
                        cartsizeItem = yield prisma.inventoryFlat.findFirst({
                            where: {
                                inventoryId,
                                flatId: flatinventoryitem === null || flatinventoryitem === void 0 ? void 0 : flatinventoryitem.flatId,
                            },
                        });
                    }
                }
                console.log(existingCartItem, userId, inventoryId, flatId, fittedId, customId);
                // Check existing cart item and update quantity
                if (existingCartItem) {
                    const updatedCartItem = yield prisma.cart.update({
                        where: { id: existingCartItem.id },
                        data: { quantity: existingCartItem.quantity + quantity },
                    });
                    return updatedCartItem;
                }
                // If no existing item, create a new cart item
                const newCartItem = yield prisma.cart.create({
                    data: {
                        userId,
                        inventoryId,
                        quantity,
                        flatId,
                        fittedId,
                        customId,
                        sellingPrice,
                        costPrice,
                        discountedPrice,
                        sizeOption,
                        selectedFlatItem,
                        selectedFittedItem,
                        selectedCustomFittedItem,
                        unit,
                        length,
                        width,
                        height,
                        remark,
                    },
                });
                return { newCartItem, cartsize: cartsizeItem };
            }
            catch (error) {
                throw new errors_1.ApiBadRequestError(error.message);
            }
        });
    }
    removeFromCart(userId, cartItemId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cartItem = yield prisma.cart.delete({
                    where: {
                        id: cartItemId,
                    },
                });
                if (!cartItem) {
                    throw new errors_1.Api404Error("Cart item not found");
                }
            }
            catch (error) {
                throw new errors_1.ApiBadRequestError(error.message);
            }
        });
    }
    updateCart(userId, cartItemId, quantity, 
    // flatId: number,
    // fittedId: number,
    // customId: number,
    sizeOption, selectedFlatItem, selectedFittedItem, selectedCustomFittedItem, unit, length, width, height, remark) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedCartItem = yield prisma.cart.update({
                    where: {
                        id: cartItemId,
                    },
                    data: {
                        quantity,
                        // flatId: flatId ?? null,
                        // fittedId: fittedId ?? null,
                        // customId: customId ?? null,
                        sizeOption,
                        selectedFlatItem,
                        selectedFittedItem,
                        selectedCustomFittedItem,
                        unit,
                        length,
                        width,
                        height,
                        remark,
                    },
                });
                return updatedCartItem;
            }
            catch (error) {
                throw new errors_1.ApiBadRequestError(error.message);
            }
        });
    }
    getUserCart(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userCart = yield prisma.cart.findMany({
                where: { userId },
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
                                include: { Fitted: true },
                            },
                            Category: true,
                            Wishlist: true,
                            ColorVariations: { include: { Color: true } },
                            relatedInventories: { include: { Media: true } },
                            relatedByInventories: { include: { Media: true } },
                            Media: true,
                            SizeChartMedia: true,
                        },
                    },
                },
                orderBy: { updatedAt: "desc" },
            });
            let totalPrice = 0;
            userCart.forEach((cartItem) => {
                var _a, _b, _c;
                const price = cartItem.discountedPrice !== undefined && cartItem.discountedPrice !== 0
                    ? (_a = cartItem.discountedPrice) !== null && _a !== void 0 ? _a : 0
                    : (_b = cartItem.sellingPrice) !== null && _b !== void 0 ? _b : 0;
                const quantity = (_c = cartItem.quantity) !== null && _c !== void 0 ? _c : 1;
                totalPrice += price * quantity;
            });
            const cartSizeItems = yield Promise.all(userCart.map((cartItem) => __awaiter(this, void 0, void 0, function* () {
                let cartSizeItem;
                if (cartItem.sizeOption === "flat" && cartItem.flatId !== null) {
                    cartSizeItem = yield prisma.inventoryFlat.findFirst({
                        where: {
                            inventoryId: cartItem.inventoryId,
                            flatId: cartItem.flatId,
                        },
                    });
                }
                else if (cartItem.sizeOption === "fitted" &&
                    cartItem.fittedId !== null) {
                    cartSizeItem = yield prisma.inventoryFitted.findFirst({
                        where: {
                            inventoryId: cartItem.inventoryId,
                            fittedId: cartItem.fittedId,
                        },
                    });
                }
                else if (cartItem.sizeOption === "custom" &&
                    cartItem.customId !== null) {
                    cartSizeItem = yield prisma.inventoryFlat.findFirst({
                        where: {
                            inventoryId: cartItem.inventoryId,
                            flatId: cartItem.customId,
                        },
                    });
                }
                return Object.assign(Object.assign({}, cartItem), { cartSizeItem });
            })));
            return { userCart: cartSizeItems, totalPrice };
        });
    }
    getAllCart() {
        return __awaiter(this, void 0, void 0, function* () {
            const userCart = yield prisma.cart.findMany({
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
            // Calculate total number of products and count by category
            let totalProducts = 0;
            const categoryCounts = {};
            userCart.forEach((cartItem) => {
                const inventory = cartItem.Inventory;
                if (inventory) {
                    totalProducts++;
                    // Counting category occurrences
                    const categoryId = inventory.categoryId;
                    if (categoryId) {
                        if (categoryCounts[categoryId]) {
                            categoryCounts[categoryId]++;
                        }
                        else {
                            categoryCounts[categoryId] = 1;
                        }
                    }
                }
            });
            let maxCategoryCount = 0;
            let maxCategoryName = "";
            for (const categoryId in categoryCounts) {
                if (categoryCounts[categoryId] > maxCategoryCount) {
                    maxCategoryCount = categoryCounts[categoryId];
                    maxCategoryName = `Category ID: ${categoryId}`;
                }
            }
            return {
                userCart,
                totalProducts,
                categoryCounts,
                maxCategoryName,
                maxCategoryCount,
            };
        });
    }
}
exports.CartService = CartService;
