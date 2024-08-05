"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDashboardData = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function getAllDashboardData(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const totalUsers = yield prisma.user.count();
            const { dateFilter } = request.query;
            const orderWhereClause = dateFilter
                ? {
                    createdAt: {
                        gte: new Date(new Date().setDate(new Date().getDate() - parseInt(dateFilter, 10))),
                    },
                    paymentStatus: "success",
                }
                : { paymentStatus: "success" };
            const totalOrders = yield prisma.order.count({ where: orderWhereClause });
            const totalCartItems = yield prisma.cart.count();
            const totalWishlistItems = yield prisma.wishlist.count();
            const topWishlistItems = yield prisma.wishlist
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
                .then((groupedItems) => __awaiter(this, void 0, void 0, function* () {
                return Promise.all(groupedItems.map((item) => __awaiter(this, void 0, void 0, function* () {
                    const inventory = yield prisma.inventory.findUnique({
                        where: { id: item.inventoryId },
                        include: {
                            Category: true,
                        },
                    });
                    return Object.assign(Object.assign({}, item), { inventory });
                })));
            }));
            const topCartItems = yield prisma.cart
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
                .then((groupedItems) => __awaiter(this, void 0, void 0, function* () {
                return Promise.all(groupedItems.map((item) => __awaiter(this, void 0, void 0, function* () {
                    const inventory = yield prisma.inventory.findUnique({
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
                    return Object.assign(Object.assign({}, item), { inventory });
                })));
            }));
            const orders = yield prisma.order.findMany({
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
        }
        catch (error) {
            reply.code(400).send({ message: error.message });
        }
    });
}
exports.getAllDashboardData = getAllDashboardData;
