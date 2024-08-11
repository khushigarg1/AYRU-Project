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
function getOrderCountsByCountry() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Query all orders and their related shipping addresses
            const orders = yield prisma.order.findMany({
                where: {
                    status: "success", // Filter for successful orders if needed
                },
                include: {
                    shippingAddress: true,
                },
            });
            // Aggregate counts by country
            const countryCounts = orders.reduce((acc, order) => {
                var _a;
                const country = (_a = order.shippingAddress) === null || _a === void 0 ? void 0 : _a.country;
                if (country) {
                    acc[country] = (acc[country] || 0) + 1;
                }
                return acc;
            }, {});
            console.log("Orders by Country:", countryCounts);
            return countryCounts;
        }
        catch (error) {
            console.error("Error fetching order counts by country:", error);
            throw error;
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
function getOrderCountsByState() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Query all orders and their related shipping addresses
            const orders = yield prisma.order.findMany({
                where: {
                    status: "success", // Filter for successful orders if needed
                },
                include: {
                    shippingAddress: true,
                },
            });
            // Aggregate counts by state
            const stateCounts = orders.reduce((acc, order) => {
                var _a;
                const state = (_a = order.shippingAddress) === null || _a === void 0 ? void 0 : _a.state;
                if (state) {
                    acc[state] = (acc[state] || 0) + 1;
                }
                return acc;
            }, {});
            console.log("Orders by State:", stateCounts);
            return stateCounts;
        }
        catch (error) {
            console.error("Error fetching order counts by state:", error);
            throw error;
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
function getAllDashboardData(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const totalUsers = yield prisma.user.count();
            const { dateFilter } = request.query;
            const totalOrders = yield prisma.order.count();
            const totalCartItems = yield prisma.cart.count();
            //-------------------------------------------------wishlist items
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
                take: 15,
            })
                .then((groupedItems) => __awaiter(this, void 0, void 0, function* () {
                return Promise.all(groupedItems.map((item) => __awaiter(this, void 0, void 0, function* () {
                    const inventory = yield prisma.inventory.findUnique({
                        where: { id: item.inventoryId },
                        select: {
                            id: true,
                            productName: true, // Assuming your inventory model has a 'name' field
                            Category: true,
                        },
                    });
                    return {
                        count: item._count.inventoryId,
                        inventory,
                    };
                })));
            }));
            //-------------------------------------------------cart items
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
                take: 15,
            })
                .then((groupedItems) => __awaiter(this, void 0, void 0, function* () {
                return Promise.all(groupedItems.map((item) => __awaiter(this, void 0, void 0, function* () {
                    const inventory = yield prisma.inventory.findUnique({
                        where: { id: item.inventoryId },
                        select: {
                            id: true,
                            productName: true, // Assuming your inventory model has a 'name' field
                            Category: true,
                        },
                    });
                    return {
                        count: item._count.inventoryId,
                        inventory,
                    };
                })));
            }));
            //------------------------------------------------ Order statistics
            const orders = yield prisma.order.findMany({
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
            const pendingOrders = yield prisma.order.count({
                where: { status: "pending" },
            });
            const successOrders = yield prisma.order.count({
                where: { status: "success" },
            });
            const failedOrders = yield prisma.order.count({
                where: { status: "failed" },
            });
            //--------------------------
            const ordersByCountry = yield getOrderCountsByCountry();
            const ordersByState = yield getOrderCountsByState();
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
        }
        catch (error) {
            reply.code(400).send({ message: error.message });
        }
    });
}
exports.getAllDashboardData = getAllDashboardData;
