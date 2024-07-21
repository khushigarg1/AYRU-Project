import { PrismaClient, Order } from "@prisma/client";
import axiosInstance from "../api";
const prisma = new PrismaClient();

// Create Order Service

let orderCounter = 0;

async function generateOrderId(): Promise<string> {
  orderCounter = (await prisma.order.count()) + 1;
  return `order##${orderCounter}`;
}
export async function createOrderService(data: any): Promise<any> {
  const orderId = await generateOrderId();
  let shippingAddress = await prisma.shippingAddress.findFirst({
    where: {
      userId: data.userId,
    },
  });

  if (!shippingAddress) {
    shippingAddress = await prisma.shippingAddress.create({
      data: {
        userId: data.userId,
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

  await prisma.user.update({
    where: { id: data.userId },
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
      userId: data.userId,
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

  const newPayment = await axiosInstance.post("/payment_links", {
    upi_link: "false",
    amount: newOrder.Total * 100,
    currency: "INR",
    accept_partial: false,
    expire_by: Math.floor(Date.now() / 1000) + 15 * 60,
    reference_id: `${newOrder.id}`,
    description: `Payment for ${newOrder.orderid}`,

    notify: {
      sms: true,
      email: true,
    },
    reminder_enable: false,
    notes: {
      policy_name: "ARYU JAIPUR",
    },
    // callback_url: "https://ayru-project.vercel.app/",
    callback_method: "get",
  });

  return { newOrder: newOrder, newPayment: newPayment.data };
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

// for (const item of data.orderItems) {
//   await prisma.orderItem.create({
//     data: {
//       orderId: newOrder.id,
//       inventoryId: item.inventoryId,
//       quantity: item.quantity,
//       sizeOption: item.sizeOption,
//       selectedFlatItem: item.selectedFlatItem,
//       selectedFittedItem: item.selectedFittedItem,
//       selectedCustomFittedItem: item.selectedCustomFittedItem,
//       unit: item.unit,
//       length: item.length,
//       width: item.width,
//       height: item.height,
//     },
//   });

//   const inventory = await prisma.inventory.findUnique({
//     where: { id: item.inventoryId },
//   });

//   if (!inventory) {
//     throw new Error("Inventory item not found");
//   }

//   const newQuantity = (inventory?.quantity ?? 0) - item.quantity;
//   const newSoldQuantity = (inventory?.soldQuantity ?? 0) + item.quantity;
//   const newMaxQuantity = (inventory?.maxQuantity ?? 0) - item.quantity;
//   let newMinQuantity = inventory?.minQuantity ?? 0;

//   if (newMinQuantity > newMaxQuantity) {
//     newMinQuantity = newMaxQuantity - 1;
//   }

//   const updatedQuantity = newQuantity < 0 ? 0 : newQuantity;
//   const updatedSoldQuantity = newSoldQuantity < 0 ? 0 : newSoldQuantity;
//   const updatedMaxQuantity = newMaxQuantity < 0 ? 0 : newMaxQuantity;
//   const updatedMinQuantity = newMinQuantity < 0 ? 0 : newMinQuantity;

//   await prisma.inventory.update({
//     where: { id: item.inventoryId },
//     data: {
//       quantity: updatedQuantity,
//       soldQuantity: updatedSoldQuantity,
//       maxQuantity: updatedMaxQuantity,
//       minQuantity: updatedMinQuantity,
//       extraOptionOutOfStock: updatedQuantity <= 0,
//     },
//   });
// }
