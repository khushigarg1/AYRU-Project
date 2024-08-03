import { PrismaClient, Order } from "@prisma/client";
import Razorpay from "razorpay";
import { ApiBadRequestError } from "../errors";
import { deleteImageFromS3, uploadImageToS3 } from "../../config/awsfunction";

const prisma = new PrismaClient();
const razorpayInstance = new Razorpay({
  key_id: process.env.KEY as string,
  key_secret: process.env.SECRET as string,
});

let orderCounter = 0;

async function generateOrderId(): Promise<string> {
  orderCounter = (await prisma.order.count()) + 1;
  return `order##${orderCounter}`;
}

export async function createOrderService(
  data: any,
  userId: number
): Promise<any> {
  try {
    const orderId = await generateOrderId();

    // let shippingAddress = await prisma.shippingAddress.findFirst({
    //   where: { userId: userId },
    // });

    // if (!shippingAddress) {
    let shippingAddress = await prisma.shippingAddress.create({
      data: {
        userId: userId,
        userName: data?.firstName + data?.lastName,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        pincode: data.pincode,
        city: data.city,
        state: data.state,
        country: data.country,
        phoneNumber: data.phoneNumber,
        alternateMobileNumber: data.alternateMobileNumber,
      },
    });
    // } else {
    //   shippingAddress = await prisma.shippingAddress.update({
    //     where: { id: shippingAddress.id },
    //     data: {
    //       addressLine2: data.addressLine2,
    //       pincode: data.pincode,
    //       city: data.city,
    //       state: data.state,
    //       country: data.country,
    //       phoneNumber: data.phoneNumber,
    //       alternateMobileNumber: data.alternateMobileNumber,
    //     },
    //   });
    // }

    let updateduser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        address1: data.addressLine1,
        address2: data.addressLine2,
        pincode: data.pincode,
        city: data.city,
        state: data.state,
        country: data.country,
        alternateMobileNumber: data.alternateMobileNumber,
      },
    });

    const newOrder = await prisma.order.create({
      data: {
        orderid: orderId,
        userId: userId,
        trekkingId1: data?.trekkingId1,
        trekkingId2: data?.trekkingId2,
        couriername: data?.couriername,
        imageurl: data?.imageurl,
        status: "pending",
        paymentStatus: "pending",
        deliveryStatus: "pending",
        giftOption: data?.giftOption,
        Total: data?.Total,
        paymentMethodId: data?.paymentMethodId,
        deliveryAddressId: shippingAddress?.id,
        remark: data?.remark,
      },
    });
    for (const item of data?.orderItems) {
      await prisma.orderItem.create({
        data: {
          orderId: newOrder?.id,
          cartId: item?.id,
          discountedPrice: item?.cartSizeItem?.discountedPrice,
          sellingPrice: item?.cartSizeItem?.sellingPrice,
          costPrice: item?.costPrice,
          inventoryId: item?.inventoryId,
          quantity: item?.quantity,
          sizeOption: item?.sizeOption,
          selectedFlatItem: item?.selectedFlatItem,
          selectedFittedItem: item?.selectedFittedItem,
          selectedCustomFittedItem: item?.selectedCustomFittedItem,
          unit: item?.unit,
          length: item?.length,
          width: item?.width,
          height: item?.height,
        },
      });
    }

    let newPayment;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const time = 20 * 60;
    const expireBy = currentTimestamp + time;
    console.log(expireBy);
    try {
      newPayment = await razorpayInstance.paymentLink.create({
        // amount: newOrder.Total,
        amount: newOrder.Total * 100,
        currency: "INR",
        accept_partial: false,
        expire_by: expireBy,
        reference_id: `${newOrder.id}`,
        description: `Payment for ${newOrder.orderid}`,
        customer: {
          name: `{${updateduser?.firstName} ${updateduser?.lastName}}`,
          contact: `{${updateduser?.phoneNumber}}`,
          email: `khushigarg.64901@gmail.com`,
          // email: `{${updateduser?.email}}`,
        },
        // customer: {
        //   name: `{${updateduser?.firstName} ${updateduser?.lastName}}`,
        //   contact: `{${updateduser?.phoneNumber}}`,
        //   email: "gaurav.kumar@example.com",
        // },
        notify: {
          sms: true,
          email: true,
        },
        reminder_enable: false,
        notes: {
          policy_name: "Jeevan Bima",
        },
        callback_url: "https://ayrujaipur.in/",
        callback_method: "get",
      });
      console.log(newPayment);
    } catch (error) {
      console.error("Error details:", error);
      throw new Error(`Payment link creation failed: ${error}`);
    }

    return { newOrder, newPayment };
  } catch (error) {
    console.error("Error details:", error);
    throw new Error(`Order creation failed: ${error}`);
  }
}
// Get Single Order Service
export async function getOrderByIdService(
  orderId: number,
  userId: number
): Promise<Order | null> {
  console.log(orderId, userId);

  return await prisma.order.findFirst({
    where: { id: orderId, userId: userId },
    include: {
      Inventory: true,
      orderItems: {
        include: {
          inventory: {
            include: {
              InventoryFlat: { include: { Flat: true } },
              InventorySubcategory: { include: { SubCategory: true } },
              customFittedInventory: {
                include: { InventoryFlat: { include: { Flat: true } } },
              },
              InventoryFitted: {
                include: {
                  Fitted: true,
                },
              },
              Category: true,
              Wishlist: true,
              ColorVariations: { include: { Color: true } },
              relatedInventories: { include: { Media: true } },
              relatedByInventories: { include: { Media: true } },
              Media: true,
            },
          },
        },
      },
      user: true,
      shippingAddress: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}
// Get Single Order Service
export async function getOrderByAdminIdService(
  orderId: number
): Promise<Order | null> {
  console.log(orderId);

  return await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      Inventory: true,
      orderItems: {
        include: {
          inventory: {
            include: {
              InventoryFlat: { include: { Flat: true } },
              InventorySubcategory: { include: { SubCategory: true } },
              customFittedInventory: {
                include: { InventoryFlat: { include: { Flat: true } } },
              },
              InventoryFitted: {
                include: {
                  Fitted: true,
                },
              },
              Category: true,
              Wishlist: true,
              ColorVariations: { include: { Color: true } },
              relatedInventories: { include: { Media: true } },
              relatedByInventories: { include: { Media: true } },
              Media: true,
            },
          },
        },
      },
      user: true,
      shippingAddress: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}

// Get Single Order Service
export async function getOrderService(id: number): Promise<Order[] | null> {
  return await prisma.order.findMany({
    where: { userId: id },
    include: {
      Inventory: true,
      orderItems: {
        include: {
          inventory: {
            include: {
              InventoryFlat: { include: { Flat: true } },
              InventorySubcategory: { include: { SubCategory: true } },
              customFittedInventory: {
                include: { InventoryFlat: { include: { Flat: true } } },
              },
              InventoryFitted: {
                include: {
                  Fitted: true,
                },
              },
              Category: true,
              Wishlist: true,
              ColorVariations: { include: { Color: true } },
              relatedInventories: { include: { Media: true } },
              relatedByInventories: { include: { Media: true } },
              Media: true,
            },
          },
        },
      },
      user: true,
      shippingAddress: true,
    },

    orderBy: {
      updatedAt: "desc",
    },
  });
}

// Get All Orders Service
export async function getOrdersService(): Promise<Order[]> {
  return await prisma.order.findMany({
    include: {
      Inventory: true,

      orderItems: {
        include: {
          inventory: {
            include: {
              InventoryFlat: { include: { Flat: true } },
              InventorySubcategory: { include: { SubCategory: true } },
              customFittedInventory: {
                include: { InventoryFlat: { include: { Flat: true } } },
              },
              InventoryFitted: {
                include: {
                  Fitted: true,
                },
              },
              Category: true,
              Wishlist: true,
              ColorVariations: { include: { Color: true } },
              relatedInventories: { include: { Media: true } },
              relatedByInventories: { include: { Media: true } },
              Media: true,
            },
          },
        },
      },
      user: true,
      shippingAddress: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}

// Update Order Service
export async function updateOrderService(
  id: number,
  data: any
): Promise<Order | null> {
  return await prisma.order.update({
    where: { id },
    data,
  });
}

// Delete Order Service
export async function deleteOrderService(id: number): Promise<Order | null> {
  return await prisma.order.delete({
    where: { id },
  });
}

export async function razorPayWebhookService(data: any) {
  try {
    console.log(JSON.stringify(data));

    // const referenceId = data?.reference_id;
    const referenceId = data?.payload?.payment_link?.entity?.reference_id;

    if (!referenceId) {
      throw new Error("Reference ID not found in webhook data");
    }

    const orderId = parseInt(referenceId, 10);
    console.log(
      "orderiiiiiiiiiiiiiiiiiddddddddddddddddd-----------------------------------------------------------------------------------------------------",
      orderId
    );

    // if (isNaN(orderId)) {
    //   throw new Error(`Invalid reference_id: ${referenceId}`);
    // }

    if (data?.event === "payment_link.paid") {
      console.log(
        "---------------------------------------------------------paid-------------------"
      );

      const orderItems = await prisma.orderItem.findMany({
        where: { orderId: orderId },
      });

      for (const item of orderItems) {
        // const inventory = await prisma.inventory.findUnique({
        //   where: { id: item.inventoryId },
        //   include: {
        //     customFittedInventory: {
        //       include: { InventoryFlat: { include: { Flat: true } } },
        //     },
        //     InventoryFlat: { include: { Flat: true } },
        //     InventoryFitted: {
        //       include: {
        //         Fitted: true,
        //       },
        //     },
        //   },
        // });

        // if (!inventory) {
        //   console.error(`Inventory item not found for ID: ${item.inventoryId}`);
        //   throw new Error("Inventory item not found");
        // }

        // const newQuantity = (inventory.quantity ?? 0) - item.quantity;
        // const newSoldQuantity = (inventory.soldQuantity ?? 0) + item.quantity;
        // const newMaxQuantity = (inventory.maxQuantity ?? 0) - item.quantity;
        // let newMinQuantity = inventory.minQuantity ?? 0;

        // if (newMinQuantity > newMaxQuantity) {
        //   newMinQuantity = newMaxQuantity - 1;
        // }

        // let updatedQuantity = newQuantity < 0 ? 0 : newQuantity;
        // let updatedSoldQuantity = newSoldQuantity < 0 ? 0 : newSoldQuantity;
        // let updatedMaxQuantity = newMaxQuantity < 0 ? 0 : newMaxQuantity;
        // let updatedMinQuantity = newMinQuantity < 0 ? 0 : newMinQuantity;

        // await prisma.inventory.update({
        //   where: { id: item.inventoryId },
        //   data: {
        //     quantity: updatedQuantity,
        //     soldQuantity: updatedSoldQuantity,
        //     maxQuantity: updatedMaxQuantity,
        //     minQuantity: updatedMinQuantity,
        //     extraOptionOutOfStock: updatedQuantity <= 0,
        //   },
        // });
        let cartdata;
        let totalquantity = 0;
        if (item?.cartId) {
          cartdata = await prisma.cart.findFirst({
            where: { id: item?.cartId },
          });
        }
        if (cartdata && item?.cartId) {
          await prisma.cart.delete({
            where: { id: item?.cartId },
          });
        }

        switch (item.sizeOption) {
          case "flat":
            if (cartdata?.flatId) {
              const flatInventory = await prisma.inventoryFlat.findFirst({
                where: {
                  inventoryId: cartdata?.inventoryId,
                  flatId: cartdata?.flatId,
                },
              });
              console.log(flatInventory);

              const newQuantity =
                (flatInventory?.quantity ?? 0) - item.quantity;
              const newSoldQuantity =
                (flatInventory?.soldQuantity ?? 0) + item.quantity;
              const newMaxQuantity =
                (flatInventory?.maxQuantity ?? 0) - item.quantity;
              let newMinQuantity = flatInventory?.minQuantity ?? 0;

              if (newMinQuantity > newMaxQuantity) {
                newMinQuantity = newMaxQuantity;
              }
              let updatedQuantity = newQuantity < 0 ? 0 : newQuantity;
              let updatedSoldQuantity =
                newSoldQuantity < 0 ? 0 : newSoldQuantity;
              let updatedMaxQuantity = newMaxQuantity < 0 ? 0 : newMaxQuantity;
              let updatedMinQuantity = newMinQuantity < 0 ? 0 : newMinQuantity;

              totalquantity += updatedQuantity;

              console.log(
                "flat prev",
                flatInventory?.quantity,
                flatInventory?.soldQuantity,
                flatInventory?.minQuantity,
                flatInventory?.maxQuantity
              );
              console.log(
                "flat updated",
                updatedQuantity,
                updatedSoldQuantity,
                updatedMinQuantity,
                updatedMaxQuantity
              );

              if (flatInventory) {
                await prisma.inventoryFlat.update({
                  where: { id: flatInventory.id },
                  data: {
                    quantity: updatedQuantity,
                    soldQuantity: updatedSoldQuantity,
                    maxQuantity: updatedMaxQuantity,
                    minQuantity: updatedMinQuantity,
                  },
                });
              }
            }
            break;

          case "fitted":
            if (cartdata?.fittedId) {
              const fittedInventory = await prisma.inventoryFitted.findFirst({
                where: {
                  inventoryId: cartdata?.inventoryId,
                  fittedId: cartdata?.fittedId,
                },
              });
              const newQuantity =
                (fittedInventory?.quantity ?? 0) - item.quantity;
              const newSoldQuantity =
                (fittedInventory?.soldQuantity ?? 0) + item.quantity;
              const newMaxQuantity =
                (fittedInventory?.maxQuantity ?? 0) - item.quantity;
              let newMinQuantity = fittedInventory?.minQuantity ?? 0;

              if (newMinQuantity > newMaxQuantity) {
                newMinQuantity = newMaxQuantity;
              }
              let updatedQuantity = newQuantity < 0 ? 0 : newQuantity;
              let updatedSoldQuantity =
                newSoldQuantity < 0 ? 0 : newSoldQuantity;
              let updatedMaxQuantity = newMaxQuantity < 0 ? 0 : newMaxQuantity;
              let updatedMinQuantity = newMinQuantity < 0 ? 0 : newMinQuantity;

              totalquantity += updatedQuantity;
              console.log(
                "flat prev",
                fittedInventory?.quantity,
                fittedInventory?.soldQuantity,
                fittedInventory?.minQuantity,
                fittedInventory?.maxQuantity
              );
              console.log(
                "flat updated",
                updatedQuantity,
                updatedSoldQuantity,
                updatedMinQuantity,
                updatedMaxQuantity
              );

              if (fittedInventory) {
                await prisma.inventoryFitted.update({
                  where: { id: fittedInventory.id },
                  data: {
                    quantity: updatedQuantity,
                    soldQuantity: updatedSoldQuantity,
                    maxQuantity: updatedMaxQuantity,
                    minQuantity: updatedMinQuantity,
                  },
                });
              }
            }
            break;

          case "custom":
            if (cartdata?.customId) {
              const flatInventory = await prisma.inventoryFlat.findFirst({
                where: {
                  inventoryId: cartdata?.inventoryId,
                  flatId: cartdata?.customId,
                },
              });
              const customInventory =
                await prisma.customFittedInventory.findFirst({
                  where: {
                    inventoryId: flatInventory?.inventoryId,
                    inventoryFlatId: flatInventory?.id,
                  },
                });

              if (customInventory?.inventoryFlatId) {
                const finalCustomInventory =
                  await prisma.inventoryFlat.findUnique({
                    where: {
                      id: customInventory?.inventoryFlatId,
                    },
                  });

                const newQuantity =
                  (finalCustomInventory?.quantity ?? 0) - item.quantity;
                const newSoldQuantity =
                  (finalCustomInventory?.soldQuantity ?? 0) + item.quantity;
                const newMaxQuantity =
                  (finalCustomInventory?.maxQuantity ?? 0) - item.quantity;
                let newMinQuantity = finalCustomInventory?.minQuantity ?? 0;

                if (newMinQuantity > newMaxQuantity) {
                  newMinQuantity = newMaxQuantity;
                }
                let updatedQuantity = newQuantity < 0 ? 0 : newQuantity;
                let updatedSoldQuantity =
                  newSoldQuantity < 0 ? 0 : newSoldQuantity;
                let updatedMaxQuantity =
                  newMaxQuantity < 0 ? 0 : newMaxQuantity;
                let updatedMinQuantity =
                  newMinQuantity < 0 ? 0 : newMinQuantity;

                totalquantity += updatedQuantity;

                console.log(
                  "flat prev",
                  finalCustomInventory?.quantity,
                  finalCustomInventory?.soldQuantity,
                  finalCustomInventory?.minQuantity,
                  finalCustomInventory?.maxQuantity
                );
                console.log(
                  "flat updated",
                  updatedQuantity,
                  updatedSoldQuantity,
                  updatedMinQuantity,
                  updatedMaxQuantity
                );

                if (finalCustomInventory) {
                  await prisma.inventoryFlat.update({
                    where: { id: finalCustomInventory.id },
                    data: {
                      quantity: updatedQuantity,
                      soldQuantity: updatedSoldQuantity,
                      maxQuantity: updatedMaxQuantity,
                      minQuantity: updatedMinQuantity,
                    },
                  });
                }
              }
            }
            break;

          default:
            console.error(`Unknown size option: ${item.sizeOption}`);
            break;
        }
        if (totalquantity === 0) {
          await prisma.inventory.update({
            where: { id: item.inventoryId },
            data: {
              extraOptionOutOfStock: true,
            },
          });
        }
      }
      // Update order status
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "success",
          paymentStatus: "paid",
        },
      });
    }

    if (data?.event === "payment_link.expired") {
      console.log(
        "---------------------------------------------------------expired--------------------------------"
      );

      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "failed",
          paymentStatus: "failed",
        },
      });
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    // Handle the error appropriately, e.g., log it, send notifications, etc.
  } finally {
    await prisma.$disconnect();
  }
}

//--------------------media

interface MediaData {
  orderId: number;
  images: any[] | any;
}

export async function uploadOrderMediaService(data: MediaData) {
  try {
    const { orderId, images } = data;

    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!existingOrder) {
      throw new ApiBadRequestError("Order not found");
    }

    let imageUploadPromises: Promise<any>[] = [];

    if (Array.isArray(images)) {
      imageUploadPromises = images
        .filter((file: any) => file.mimetype.startsWith("image"))
        .map((image: any) => uploadImageToS3(image));
    } else if (images && images.mimetype.startsWith("image")) {
      imageUploadPromises.push(uploadImageToS3(images));
    }

    const imageResults = await Promise.all(imageUploadPromises);
    const urls = imageResults.map((result) => result?.key);

    if (urls.length > 0) {
      const newImageUrl = urls[0];
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { imageurl: newImageUrl },
      });

      return updatedOrder;
    }

    throw new Error("No valid image URLs found");
  } catch (error) {
    console.error("Error in uploadOrderMedia:", error);
    throw new Error("Failed to process media upload: " + error);
  }
}
