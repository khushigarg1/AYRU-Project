import { PrismaClient, Order } from "@prisma/client";
import Razorpay from "razorpay";

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

    let shippingAddress = await prisma.shippingAddress.findFirst({
      where: { userId: userId },
    });

    if (!shippingAddress) {
      shippingAddress = await prisma.shippingAddress.create({
        data: {
          userId: userId,
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
    } else {
      shippingAddress = await prisma.shippingAddress.update({
        where: { id: shippingAddress.id },
        data: {
          addressLine2: data.addressLine2,
          pincode: data.pincode,
          city: data.city,
          state: data.state,
          country: data.country,
          phoneNumber: data.phoneNumber,
          alternateMobileNumber: data.alternateMobileNumber,
        },
      });
    }

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
        trekkingId1: data.trekkingId1,
        trekkingId2: data.trekkingId2,
        couriername: data.couriername,
        imageurl: data.imageurl,
        status: "pending",
        paymentStatus: "pending",
        deliveryStatus: "pending",
        giftOption: data.giftOption,
        Total: data.Total,
        paymentMethodId: data.paymentMethodId,
        deliveryAddressId: shippingAddress.id,
        remark: data.remark,
      },
    });
    for (const item of data?.orderItems) {
      await prisma.orderItem.create({
        data: {
          orderId: newOrder?.id,
          cartId: item?.id,
          inventoryId: item.inventoryId,
          quantity: item.quantity,
          sizeOption: item.sizeOption,
          selectedFlatItem: item.selectedFlatItem,
          selectedFittedItem: item.selectedFittedItem,
          selectedCustomFittedItem: item.selectedCustomFittedItem,
          unit: item.unit,
          length: item.length,
          width: item.width,
          height: item.height,
        },
      });
    }
    // console.log(userId, newOrder);

    let newPayment;
    try {
      const expireBy = Math.floor(Date.now() / 1000) + 25 * 60;

      newPayment = await razorpayInstance.paymentLink.create({
        // amount: newOrder.Total,
        amount: newOrder.Total * 100,
        currency: "INR",
        accept_partial: false,
        expire_by: expireBy,
        reference_id: `${newOrder.id}`,
        description: `Payment for ${newOrder.orderid}`,
        // customer: {
        //   name: `{${updateduser?.firstName} ${updateduser?.lastName}}`,
        //   contact: `{${updateduser?.phoneNumber}}`,
        //   email: `{${updateduser?.email}}`,
        // },
        customer: {
          name: `{${updateduser?.firstName} ${updateduser?.lastName}}`,
          contact: `{${updateduser?.phoneNumber}}`,
          email: "gaurav.kumar@example.com",
        },
        notify: {
          sms: true,
          email: true,
        },
        reminder_enable: false,
        notes: {
          policy_name: "Jeevan Bima",
        },
        callback_url: "http://localhost:3000/",
        callback_method: "get",
      });
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
export async function getOrderService(id: number): Promise<Order | null> {
  return await prisma.order.findUnique({
    where: { id },
    include: {
      Inventory: true,
      // User: true,
      // PaymentMethod: true,
      // ShippingAddress: true,
    },
  });
}

// Get All Orders Service
export async function getOrdersService(): Promise<Order[]> {
  return await prisma.order.findMany({
    include: {
      Inventory: true,
      // User: true,
      // PaymentMethod: true,
      // ShippingAddress: true,
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
// Ensure correct type definitions
interface OrderItem {
  id: number;
  orderId: number;
  inventoryId: number;
  quantity: number;
  sizeOption: string | null;
  selectedFlatItem: string | null;
  selectedFittedItem: string | null;
  selectedCustomFittedItem: string | null;
  unit: string | null;
  length: number | null;
  width: number | null;
  height: number | null;
  flatId: number | null; // Nullable Integer
  fittedId: number | null; // Nullable Integer
  customId: number | null; // Nullable Integer
}

// Modify your function to handle potential null values
export async function razorPayWebhookService(data: any) {
  try {
    console.log("Received Webhook Data:", JSON.stringify(data, null, 2));

    const referenceId = data?.payload?.payment_link?.entity?.reference_id;

    if (!referenceId) {
      throw new Error("Reference ID not found in webhook data");
    }

    const orderId = parseInt(referenceId, 10);
    console.log("Parsed Order ID:", orderId);

    if (isNaN(orderId)) {
      throw new Error(`Invalid reference_id: ${referenceId}`);
    }

    if (data?.event === "payment_link.paid") {
      console.log("Handling payment_link.paid event");

      const orderItems = await prisma.orderItem.findMany({
        where: { orderId: orderId },
      });

      for (const item of orderItems) {
        const inventory = await prisma.inventory.findUnique({
          where: { id: item.inventoryId },
          include: {
            customFittedInventory: {
              include: { InventoryFlat: { include: { Flat: true } } },
            },
            InventoryFlat: { include: { Flat: true } },
            InventoryFitted: {
              include: {
                Fitted: true,
              },
            },
          },
        });

        if (!inventory) {
          console.error(`Inventory item not found for ID: ${item.inventoryId}`);
          throw new Error("Inventory item not found");
        }

        const newQuantity = (inventory.quantity ?? 0) - item.quantity;
        const newSoldQuantity = (inventory.soldQuantity ?? 0) + item.quantity;
        const newMaxQuantity = (inventory.maxQuantity ?? 0) - item.quantity;
        let newMinQuantity = inventory.minQuantity ?? 0;

        if (newMinQuantity > newMaxQuantity) {
          newMinQuantity = newMaxQuantity - 1;
        }

        let updatedQuantity = newQuantity < 0 ? 0 : newQuantity;
        let updatedSoldQuantity = newSoldQuantity < 0 ? 0 : newSoldQuantity;
        let updatedMaxQuantity = newMaxQuantity < 0 ? 0 : newMaxQuantity;
        let updatedMinQuantity = newMinQuantity < 0 ? 0 : newMinQuantity;

        await prisma.inventory.update({
          where: { id: item.inventoryId },
          data: {
            quantity: updatedQuantity,
            soldQuantity: updatedSoldQuantity,
            maxQuantity: updatedMaxQuantity,
            minQuantity: updatedMinQuantity,
            extraOptionOutOfStock: updatedQuantity <= 0,
          },
        });
        let cartdata;
        if (item?.cartId) {
          cartdata = await prisma.cart.findFirst({
            where: { id: item?.cartId },
          });
        }
        // if (item?.cartId) {
        //   cartdata = await prisma.cart.update({
        //     where: { id: item?.cartId },
        //     data: {
        //       quantity: newQuantity,
        //     },
        //   });
        // }
        console.log(item?.sizeOption, item);

        switch (item.sizeOption) {
          case "flat":
            if (cartdata?.flatId) {
              const flatInventory = await prisma.inventoryFlat.findUnique({
                where: {
                  id: cartdata?.flatId,
                },
              });
              const newQuantity =
                (flatInventory?.quantity ?? 0) - item.quantity;
              const newSoldQuantity =
                (flatInventory?.soldQuantity ?? 0) + item.quantity;
              const newMaxQuantity =
                (flatInventory?.maxQuantity ?? 0) - item.quantity;
              let newMinQuantity = flatInventory?.minQuantity ?? 0;

              if (newMinQuantity > newMaxQuantity) {
                newMinQuantity = newMaxQuantity - 1;
              }
              let updatedQuantity = newQuantity < 0 ? 0 : newQuantity;
              let updatedSoldQuantity =
                newSoldQuantity < 0 ? 0 : newSoldQuantity;
              let updatedMaxQuantity = newMaxQuantity < 0 ? 0 : newMaxQuantity;
              let updatedMinQuantity = newMinQuantity < 0 ? 0 : newMinQuantity;

              console.log("flat", flatInventory);

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
              const fittedInventory = await prisma.inventoryFitted.findUnique({
                where: {
                  id: cartdata?.fittedId,
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
                newMinQuantity = newMaxQuantity - 1;
              }
              let updatedQuantity = newQuantity < 0 ? 0 : newQuantity;
              let updatedSoldQuantity =
                newSoldQuantity < 0 ? 0 : newSoldQuantity;
              let updatedMaxQuantity = newMaxQuantity < 0 ? 0 : newMaxQuantity;
              let updatedMinQuantity = newMinQuantity < 0 ? 0 : newMinQuantity;

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
              const customInventory =
                await prisma.customFittedInventory.findUnique({
                  where: {
                    id: cartdata?.customId,
                  },
                });
              console.log("custom", customInventory);

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
                  newMinQuantity = newMaxQuantity - 1;
                }
                let updatedQuantity = newQuantity < 0 ? 0 : newQuantity;
                let updatedSoldQuantity =
                  newSoldQuantity < 0 ? 0 : newSoldQuantity;
                let updatedMaxQuantity =
                  newMaxQuantity < 0 ? 0 : newMaxQuantity;
                let updatedMinQuantity =
                  newMinQuantity < 0 ? 0 : newMinQuantity;

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
      console.log("Handling payment_link.expired event");

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
