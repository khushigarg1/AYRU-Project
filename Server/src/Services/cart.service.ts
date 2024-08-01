// // services/CartService.ts
// import { PrismaClient } from "@prisma/client";
// import { ApiBadRequestError, Api404Error } from "../errors";

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
import { PrismaClient } from "@prisma/client";
import { ApiBadRequestError, Api404Error } from "../errors";

const prisma = new PrismaClient();

export class CartService {
  async addToCart(
    userId: number,
    inventoryId: number,
    quantity: number,
    flatId: number,
    fittedId: number,
    customId: number,
    sellingPrice: number,
    costPrice: number,
    discountedPrice: number,
    sizeOption: string,
    selectedFlatItem: string,
    selectedFittedItem: string,
    selectedCustomFittedItem: string,
    unit: string,
    length?: number,
    width?: number,
    height?: number,
    remark?: string
  ) {
    try {
      // Find an existing cart item
      let existingCartItem;
      let cartsizeItem;
      // Find an existing cart item based on sizeOption
      if (sizeOption === "flat") {
        existingCartItem = await prisma.cart.findFirst({
          where: {
            userId,
            inventoryId,
            flatId,
          },
        });
        cartsizeItem = await prisma.inventoryFlat.findFirst({
          where: {
            inventoryId,
            flatId,
          },
        });
      } else if (sizeOption === "fitted") {
        existingCartItem = await prisma.cart.findFirst({
          where: {
            userId,
            inventoryId,
            fittedId,
          },
        });
        cartsizeItem = await prisma.inventoryFitted.findFirst({
          where: {
            inventoryId,
            fittedId,
          },
        });
      } else if (sizeOption === "custom") {
        existingCartItem = await prisma.cart.findFirst({
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

        cartsizeItem = await prisma.inventoryFlat.findFirst({
          where: {
            inventoryId,
            flatId: customId,
          },
        });
      }

      console.log(
        existingCartItem,
        userId,
        inventoryId,
        flatId,
        fittedId,
        customId
      );
      // Check existing cart item and update quantity
      if (existingCartItem) {
        const updatedCartItem = await prisma.cart.update({
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + quantity },
        });
        return updatedCartItem;
      }

      // If no existing item, create a new cart item
      const newCartItem = await prisma.cart.create({
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
    } catch (error: any) {
      throw new ApiBadRequestError(error.message);
    }
  }

  async removeFromCart(userId: number, cartItemId: number) {
    try {
      const cartItem = await prisma.cart.delete({
        where: {
          id: cartItemId,
        },
      });
      if (!cartItem) {
        throw new Api404Error("Cart item not found");
      }
    } catch (error: any) {
      throw new ApiBadRequestError(error.message);
    }
  }

  async updateCart(
    userId: number,
    cartItemId: number,
    quantity: number,
    // flatId: number,
    // fittedId: number,
    // customId: number,
    sizeOption: string,
    selectedFlatItem: string,
    selectedFittedItem: string,
    selectedCustomFittedItem: string,
    unit: string,
    length?: number,
    width?: number,
    height?: number,
    remark?: string
  ) {
    try {
      const updatedCartItem = await prisma.cart.update({
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
    } catch (error: any) {
      throw new ApiBadRequestError(error.message);
    }
  }

  async getUserCart(userId: number) {
    const userCart = await prisma.cart.findMany({
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
      const price: number =
        cartItem.discountedPrice !== undefined && cartItem.discountedPrice !== 0
          ? cartItem.discountedPrice ?? 0
          : cartItem.sellingPrice ?? 0;

      const quantity = cartItem.quantity ?? 1;
      totalPrice += price * quantity;
    });

    const cartSizeItems = await Promise.all(
      userCart.map(async (cartItem) => {
        let cartSizeItem;

        if (cartItem.sizeOption === "flat" && cartItem.flatId !== null) {
          cartSizeItem = await prisma.inventoryFlat.findFirst({
            where: {
              inventoryId: cartItem.inventoryId,
              flatId: cartItem.flatId,
            },
          });
        } else if (
          cartItem.sizeOption === "fitted" &&
          cartItem.fittedId !== null
        ) {
          cartSizeItem = await prisma.inventoryFitted.findFirst({
            where: {
              inventoryId: cartItem.inventoryId,
              fittedId: cartItem.fittedId,
            },
          });
        } else if (
          cartItem.sizeOption === "custom" &&
          cartItem.customId !== null
        ) {
          cartSizeItem = await prisma.inventoryFlat.findFirst({
            where: {
              inventoryId: cartItem.inventoryId,
              flatId: cartItem.customId,
            },
          });
        }

        return { ...cartItem, cartSizeItem };
      })
    );

    return { userCart: cartSizeItems, totalPrice };
  }

  async getAllCart() {
    const userCart = await prisma.cart.findMany({
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
    const categoryCounts: Record<number, number> = {};

    userCart.forEach((cartItem) => {
      const inventory = cartItem.Inventory;
      if (inventory) {
        totalProducts++;

        // Counting category occurrences
        const categoryId = inventory.categoryId;
        if (categoryId) {
          if (categoryCounts[categoryId]) {
            categoryCounts[categoryId]++;
          } else {
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
  }
}
