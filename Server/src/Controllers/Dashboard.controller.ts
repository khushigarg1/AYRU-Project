import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getOrderCountsByCountry() {
  try {
    // Query all orders and their related shipping addresses
    const orders = await prisma.order.findMany({
      where: {
        status: "success", // Filter for successful orders if needed
      },
      include: {
        shippingAddress: true,
      },
    });

    // Aggregate counts by country
    const countryCounts = orders.reduce<Record<string, number>>(
      (acc, order) => {
        const country = order.shippingAddress?.country;
        if (country) {
          acc[country] = (acc[country] || 0) + 1;
        }
        return acc;
      },
      {}
    );

    console.log("Orders by Country:", countryCounts);
    return countryCounts;
  } catch (error) {
    console.error("Error fetching order counts by country:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function getOrderCountsByState() {
  try {
    // Query all orders and their related shipping addresses
    const orders = await prisma.order.findMany({
      where: {
        status: "success", // Filter for successful orders if needed
      },
      include: {
        shippingAddress: true,
      },
    });

    // Aggregate counts by state
    const stateCounts = orders.reduce<Record<string, number>>((acc, order) => {
      const state = order.shippingAddress?.state;
      if (state) {
        acc[state] = (acc[state] || 0) + 1;
      }
      return acc;
    }, {});

    console.log("Orders by State:", stateCounts);
    return stateCounts;
  } catch (error) {
    console.error("Error fetching order counts by state:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getAllDashboardData(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const totalUsers = await prisma.user.count();

    const { dateFilter } = request.query as { dateFilter?: string };
    const totalOrders = await prisma.order.count();

    const totalCartItems = await prisma.cart.count();

    //-------------------------------------------------wishlist items
    const totalWishlistItems = await prisma.wishlist.count();
    const topWishlistItems = await prisma.wishlist
      .groupBy({
        by: ["inventoryId"],
        _count: {
          inventoryId: true,
        },
        orderBy: {
          _count: {
            inventoryId: "desc",
          },
        },
        take: 15,
      })
      .then(async (groupedItems) => {
        return Promise.all(
          groupedItems.map(async (item) => {
            const inventory = await prisma.inventory.findUnique({
              where: { id: item.inventoryId },
              select: {
                productName: true, // Assuming your inventory model has a 'name' field
                Category: true,
              },
            });
            return {
              count: item._count.inventoryId,
              inventory,
            };
          })
        );
      });

    //-------------------------------------------------cart items

    const topCartItems = await prisma.cart
      .groupBy({
        by: ["inventoryId"],
        _count: {
          inventoryId: true,
        },
        orderBy: {
          _count: {
            inventoryId: "desc",
          },
        },
        take: 15,
      })
      .then(async (groupedItems) => {
        return Promise.all(
          groupedItems.map(async (item) => {
            const inventory = await prisma.inventory.findUnique({
              where: { id: item.inventoryId },
              select: {
                productName: true, // Assuming your inventory model has a 'name' field
                Category: true,
              },
            });
            return {
              count: item._count.inventoryId,
              inventory,
            };
          })
        );
      });

    //------------------------------------------------ Order statistics
    const orders = await prisma.order.findMany({
      where: { paymentStatus: "paid" },
      include: { orderItems: true },
    });

    let totalRevenue = 0;
    let totalProfit = 0;
    let totalCost = 0;
    let totalSellingPrice = 0;
    let totalDiscountedPrice = 0;
    let totalItems = 0;

    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        const sellingPrice = item.sellingPrice || 0;
        const discountedPrice = item.discountedPrice || 0;
        const costPrice = item.costPrice || 0;
        const revenue = discountedPrice || sellingPrice;
        const profit = revenue - costPrice;

        totalRevenue += revenue;
        totalProfit += profit;
        totalCost += costPrice;
        totalSellingPrice += sellingPrice;
        totalDiscountedPrice += discountedPrice;
        totalItems += 1; // Count the number of items
      });
    });
    const pendingOrders = await prisma.order.count({
      where: { status: "pending" },
    });
    const successOrders = await prisma.order.count({
      where: { status: "success" },
    });
    const failedOrders = await prisma.order.count({
      where: { status: "failed" },
    });

    //--------------------------
    const ordersByCountry = await getOrderCountsByCountry();
    const ordersByState = await getOrderCountsByState();

    const statistics = {
      totalUsers,
      totalOrders,
      totalCartItems,
      totalWishlistItems,
      topWishlistItems,
      topCartItems,
      pendingOrders,
      successOrders,
      failedOrders,
      ordersByCountry,
      ordersByState,
      totalRevenue,
      totalProfit,
      totalCost,
      totalSellingPrice,
      totalDiscountedPrice,
      totalItems,
    };

    reply.code(200).send(statistics);
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}
