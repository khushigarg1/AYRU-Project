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
    console.log(userId);

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

    let newPayment;
    try {
      const expireBy = Math.floor(Date.now() / 1000) + 25 * 60;

      newPayment = await razorpayInstance.paymentLink.create({
        amount: newOrder.Total,
        // amount: newOrder.Total * 100,
        currency: "INR",
        accept_partial: false,
        expire_by: expireBy,
        reference_id: `${newOrder.id}`,
        description: `Payment for ${newOrder.orderid}`,
        customer: {
          name: `{${updateduser?.firstName} ${updateduser?.lastName}}`,
          contact: `{${updateduser?.phoneNumber}}`,
          email: `{${updateduser?.email}}`,
        },
        notify: {
          sms: true,
          email: true,
        },
        reminder_enable: false,
        notes: {
          policy_name: "Jeevan Bima",
        },
        callback_url: "https://your-callback-url.com",
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
