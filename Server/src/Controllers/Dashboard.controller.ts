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
    // const { dateFilter } = request.query as { dateFilter?: string };

    const { startDate, endDate } = request.query as {
      startDate?: string;
      endDate?: string;
    };

    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    const dateRangeFilter =
      start && end
        ? {
            gte: start,
            lte: end,
          }
        : undefined;

    const totalUsers = await prisma.user.count({
      where: dateRangeFilter ? { createdAt: dateRangeFilter } : {},
    });
    const totalOrders = await prisma.order.count({
      where: dateRangeFilter ? { createdAt: dateRangeFilter } : {},
    });

    const totalCartItems = await prisma.cart.count({
      where: dateRangeFilter ? { createdAt: dateRangeFilter } : {},
    });

    //-------------------------------------------------wishlist items
    const totalWishlistItems = await prisma.wishlist.count({
      where: dateRangeFilter ? { createdAt: dateRangeFilter } : {},
    });

    const topWishlistItems = await prisma.wishlist
      .groupBy({
        by: ["inventoryId"],
        _count: {
          inventoryId: true,
        },
        where: dateRangeFilter ? { createdAt: dateRangeFilter } : {},
        orderBy: {
          _count: {
            inventoryId: "desc",
          },
        },
        take: 30,
      })
      .then(async (groupedItems) => {
        return Promise.all(
          groupedItems.map(async (item) => {
            const inventory = await prisma.inventory.findUnique({
              where: { id: item.inventoryId },
              select: {
                id: true,
                productName: true,
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
        where: dateRangeFilter ? { createdAt: dateRangeFilter } : {},
        orderBy: {
          _count: {
            inventoryId: "desc",
          },
        },
        take: 30,
      })
      .then(async (groupedItems) => {
        return Promise.all(
          groupedItems.map(async (item) => {
            const inventory = await prisma.inventory.findUnique({
              where: { id: item.inventoryId },
              select: {
                id: true,
                productName: true,
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
      where: { paymentStatus: "paid", createdAt: dateRangeFilter },
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
        totalItems += 1;
      });
    });

    const pendingOrders = await prisma.order.count({
      where: {
        status: "pending",
        createdAt: dateRangeFilter,
      },
    });
    const successOrders = await prisma.order.count({
      where: {
        status: "success",
        createdAt: dateRangeFilter,
      },
    });
    const failedOrders = await prisma.order.count({
      where: {
        status: "failed",
        createdAt: dateRangeFilter,
      },
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
