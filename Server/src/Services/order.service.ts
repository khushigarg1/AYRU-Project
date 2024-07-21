import { PrismaClient, Order } from "@prisma/client";

const prisma = new PrismaClient();

// Create Order Service

let orderCounter = 0;

async function generateOrderId(): Promise<string> {
  orderCounter = (await prisma.order.count()) + 1;
  return `order##${orderCounter}`;
}
export async function createOrderService(data: any): Promise<Order> {
  const orderId = await generateOrderId();

  const newOrder = await prisma.order.create({
    data: {
      orderid: orderId,
      userId: data.userId,
      trekkingId1: data.trekkingId1,
      trekkingId2: data.trekkingid2,
      couriername: data.couriername,
      imageurl: data.imageurl,
      status: "pending",
      paymentStatus: "pending",
      deliveryStatus: "pending",
      giftOption: data.giftOption,
      Total: data.Total,
      paymentMethodId: data.paymentMethodId,
      deliveryAddressId: data.deliveryAddressId,
      remark: data.remark,
    },
  });

  for (const item of data.orderItems) {
    await prisma.orderItem.create({
      data: {
        orderId: newOrder.id,
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

    const inventory = await prisma.inventory.findUnique({
      where: { id: item.inventoryId },
    });

    if (!inventory) {
      throw new Error("Inventory item not found");
    }

    const newQuantity = (inventory?.quantity ?? 0) - item.quantity;
    const newSoldQuantity = (inventory?.soldQuantity ?? 0) + item.quantity;
    const newMaxQuantity = (inventory?.maxQuantity ?? 0) - item.quantity;
    let newMinQuantity = inventory?.minQuantity ?? 0;

    if (newMinQuantity > newMaxQuantity) {
      newMinQuantity = newMaxQuantity - 1;
    }

    const updatedQuantity = newQuantity < 0 ? 0 : newQuantity;
    const updatedSoldQuantity = newSoldQuantity < 0 ? 0 : newSoldQuantity;
    const updatedMaxQuantity = newMaxQuantity < 0 ? 0 : newMaxQuantity;
    const updatedMinQuantity = newMinQuantity < 0 ? 0 : newMinQuantity;

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
  }

  return newOrder;
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
