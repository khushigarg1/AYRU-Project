import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAllDashboardData(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const totalUsers = await prisma.user.count();

    const { dateFilter } = request.query as { dateFilter?: string };
    const orderWhereClause = dateFilter
      ? {
          createdAt: {
            gte: new Date(
              new Date().setDate(
                new Date().getDate() - parseInt(dateFilter, 10)
              )
            ),
          },
          paymentStatus: "success",
        }
      : { paymentStatus: "success" };

    const totalOrders = await prisma.order.count({ where: orderWhereClause });

    const totalCartItems = await prisma.cart.count();

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
        take: 10,
      })
      .then(async (groupedItems) => {
        return Promise.all(
          groupedItems.map(async (item) => {
            const inventory = await prisma.inventory.findUnique({
              where: { id: item.inventoryId },
              include: {
                Category: true,
              },
            });
            return { ...item, inventory };
          })
        );
      });

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
        take: 10,
      })
      .then(async (groupedItems) => {
        return Promise.all(
          groupedItems.map(async (item) => {
            const inventory = await prisma.inventory.findUnique({
              where: { id: item.inventoryId },
              include: {
                // customFittedInventory: {
                //   include: { InventoryFlat: { include: { Flat: true } } },
                // },
                // InventoryFlat: { include: { Flat: true } },
                // InventorySubcategory: { include: { SubCategory: true } },
                // InventoryFitted: {
                //   include: { Fitted: true },
                // },
                Category: true,
                // Wishlist: true,
                // ColorVariations: { include: { Color: true } },
                // relatedInventories: { include: { Media: true } },
                // relatedByInventories: { include: { Media: true } },
                // Media: true,
                // SizeChartMedia: true,
              },
            });
            return { ...item, inventory };
          })
        );
      });

    const orders = await prisma.order.findMany({
      where: { paymentStatus: "success" },
      include: { orderItems: true },
    });

    let totalRevenue = 0;
    let totalProfit = 0;

    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        const revenue = item.discountedPrice || item.sellingPrice || 0;
        const profit = revenue - (item.costPrice || 0);
        totalRevenue += revenue;
        totalProfit += profit;
      });
    });

    const statistics = {
      totalUsers,
      totalOrders,
      totalCartItems,
      totalWishlistItems,
      topWishlistItems,
      topCartItems,
      totalRevenue,
      totalProfit,
    };

    reply.code(200).send(statistics);
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}
