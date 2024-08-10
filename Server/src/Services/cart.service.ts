import { PrismaClient } from "@prisma/client";
import { ApiBadRequestError, Api404Error } from "../errors";
import { omitCostPrice } from "../utils/omitCostPrice";
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
      let existingCartItem;
      let cartsizeItem;
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

        const inventoryflatItem = await prisma.inventoryFlat.findFirst({
          where: {
            inventoryId,
            flatId: customId,
          },
        });
        cartsizeItem = await prisma.customFittedInventory.findFirst({
          where: {
            inventoryId,
            inventoryFlatId: inventoryflatItem?.id,
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
    const cart = await prisma.cart.findMany({
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
      orderBy: { createdAt: "desc" },
    });

    const userCart = await omitCostPrice(cart);
    const cartSizeItems = await Promise.all(
      userCart.map(async (cartItem: any) => {
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
          const inventoryflatItem = await prisma.inventoryFlat.findFirst({
            where: {
              inventoryId: cartItem?.inventoryId,
              flatId: cartItem?.customId,
            },
          });
          cartSizeItem = await prisma.customFittedInventory.findFirst({
            where: {
              inventoryId: cartItem?.inventoryId,
              inventoryFlatId: inventoryflatItem?.id,
            },
          });
          cartSizeItem = {
            ...cartSizeItem,
            quantity: inventoryflatItem?.quantity,
            minQuantity: inventoryflatItem?.minQuantity,
            maxQuantity: inventoryflatItem?.maxQuantity,
          };
        }
        cartSizeItem = await omitCostPrice(cartSizeItem);

        return { ...cartItem, cartSizeItem };
      })
    );

    let totalPrice = 0;

    cartSizeItems.forEach((cartItem) => {
      const price: number =
        cartItem?.cartSizeItem?.discountedPrice !== undefined &&
        cartItem.cartSizeItem?.discountedPrice !== 0
          ? cartItem?.cartSizeItem?.discountedPrice ?? 0
          : cartItem?.cartSizeItem?.sellingPrice ?? 0;

      const quantity = cartItem.quantity ?? 1;
      totalPrice += price * quantity;
    });

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
        createdAt: "desc",
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
          const inventoryflatItem = await prisma.inventoryFlat.findFirst({
            where: {
              inventoryId: cartItem?.inventoryId,
              flatId: cartItem?.customId,
            },
          });
          cartSizeItem = await prisma.customFittedInventory.findFirst({
            where: {
              inventoryId: cartItem?.inventoryId,
              inventoryFlatId: inventoryflatItem?.id,
            },
          });
        }

        return { ...cartItem, cartSizeItem };
      })
    );

    return {
      userCart: cartSizeItems,
      totalProducts,
      categoryCounts,
      maxCategoryName,
      maxCategoryCount,
    };
  }
}
