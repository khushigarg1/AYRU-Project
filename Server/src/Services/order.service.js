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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.razorPayWebhookService = exports.deleteOrderService = exports.updateOrderService = exports.getOrdersService = exports.getOrderService = exports.getOrderByAdminIdService = exports.getOrderByIdService = exports.createOrderService = void 0;
const client_1 = require("@prisma/client");
const razorpay_1 = __importDefault(require("razorpay"));
const prisma = new client_1.PrismaClient();
const razorpayInstance = new razorpay_1.default({
    key_id: process.env.KEY,
    key_secret: process.env.SECRET,
});
let orderCounter = 0;
function generateOrderId() {
    return __awaiter(this, void 0, void 0, function* () {
        orderCounter = (yield prisma.order.count()) + 1;
        return `order##${orderCounter}`;
    });
}
function createOrderService(data, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const orderId = yield generateOrderId();
            // let shippingAddress = await prisma.shippingAddress.findFirst({
            //   where: { userId: userId },
            // });
            // if (!shippingAddress) {
            let shippingAddress = yield prisma.shippingAddress.create({
                data: {
                    userId: userId,
                    userName: (data === null || data === void 0 ? void 0 : data.firstName) + (data === null || data === void 0 ? void 0 : data.lastName),
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
            let updateduser = yield prisma.user.update({
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
            const newOrder = yield prisma.order.create({
                data: {
                    orderid: orderId,
                    userId: userId,
                    trekkingId1: data === null || data === void 0 ? void 0 : data.trekkingId1,
                    trekkingId2: data === null || data === void 0 ? void 0 : data.trekkingId2,
                    couriername: data === null || data === void 0 ? void 0 : data.couriername,
                    imageurl: data === null || data === void 0 ? void 0 : data.imageurl,
                    status: "pending",
                    paymentStatus: "pending",
                    deliveryStatus: "pending",
                    giftOption: data === null || data === void 0 ? void 0 : data.giftOption,
                    Total: data === null || data === void 0 ? void 0 : data.Total,
                    paymentMethodId: data === null || data === void 0 ? void 0 : data.paymentMethodId,
                    deliveryAddressId: shippingAddress === null || shippingAddress === void 0 ? void 0 : shippingAddress.id,
                    remark: data === null || data === void 0 ? void 0 : data.remark,
                },
            });
            for (const item of data === null || data === void 0 ? void 0 : data.orderItems) {
                yield prisma.orderItem.create({
                    data: {
                        orderId: newOrder === null || newOrder === void 0 ? void 0 : newOrder.id,
                        cartId: item === null || item === void 0 ? void 0 : item.id,
                        discountedPrice: item === null || item === void 0 ? void 0 : item.discountedPrice,
                        sellingPrice: item === null || item === void 0 ? void 0 : item.sellingPrice,
                        costPrice: item === null || item === void 0 ? void 0 : item.costPrice,
                        inventoryId: item === null || item === void 0 ? void 0 : item.inventoryId,
                        quantity: item === null || item === void 0 ? void 0 : item.quantity,
                        sizeOption: item === null || item === void 0 ? void 0 : item.sizeOption,
                        selectedFlatItem: item === null || item === void 0 ? void 0 : item.selectedFlatItem,
                        selectedFittedItem: item === null || item === void 0 ? void 0 : item.selectedFittedItem,
                        selectedCustomFittedItem: item === null || item === void 0 ? void 0 : item.selectedCustomFittedItem,
                        unit: item === null || item === void 0 ? void 0 : item.unit,
                        length: item === null || item === void 0 ? void 0 : item.length,
                        width: item === null || item === void 0 ? void 0 : item.width,
                        height: item === null || item === void 0 ? void 0 : item.height,
                    },
                });
            }
            let newPayment;
            try {
                const currentTimestamp = Math.floor(Date.now() / 1000);
                const expireBy = currentTimestamp + 25 * 60;
                console.log(expireBy);
                newPayment = yield razorpayInstance.paymentLink.create({
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
                        name: `{${updateduser === null || updateduser === void 0 ? void 0 : updateduser.firstName} ${updateduser === null || updateduser === void 0 ? void 0 : updateduser.lastName}}`,
                        contact: `{${updateduser === null || updateduser === void 0 ? void 0 : updateduser.phoneNumber}}`,
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
                    callback_url: "https://7q0xhxzq-3000.inc1.devtunnels.ms/orders",
                    callback_method: "get",
                });
                console.log(newPayment);
            }
            catch (error) {
                console.error("Error details:", error);
                throw new Error(`Payment link creation failed: ${error}`);
            }
            return { newOrder, newPayment };
        }
        catch (error) {
            console.error("Error details:", error);
            throw new Error(`Order creation failed: ${error}`);
        }
    });
}
exports.createOrderService = createOrderService;
// Get Single Order Service
function getOrderByIdService(orderId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(orderId, userId);
        return yield prisma.order.findFirst({
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
    });
}
exports.getOrderByIdService = getOrderByIdService;
// Get Single Order Service
function getOrderByAdminIdService(orderId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(orderId);
        return yield prisma.order.findFirst({
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
    });
}
exports.getOrderByAdminIdService = getOrderByAdminIdService;
// Get Single Order Service
function getOrderService(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.order.findMany({
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
    });
}
exports.getOrderService = getOrderService;
// Get All Orders Service
function getOrdersService() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.order.findMany({
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
    });
}
exports.getOrdersService = getOrdersService;
// Update Order Service
function updateOrderService(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.order.update({
            where: { id },
            data,
        });
    });
}
exports.updateOrderService = updateOrderService;
// Delete Order Service
function deleteOrderService(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.order.delete({
            where: { id },
        });
    });
}
exports.deleteOrderService = deleteOrderService;
function razorPayWebhookService(data) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
        try {
            console.log(JSON.stringify(data));
            // const referenceId = data?.reference_id;
            const referenceId = (_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.payload) === null || _a === void 0 ? void 0 : _a.payment_link) === null || _b === void 0 ? void 0 : _b.entity) === null || _c === void 0 ? void 0 : _c.reference_id;
            if (!referenceId) {
                throw new Error("Reference ID not found in webhook data");
            }
            const orderId = parseInt(referenceId, 10);
            if (isNaN(orderId)) {
                throw new Error(`Invalid reference_id: ${referenceId}`);
            }
            if ((data === null || data === void 0 ? void 0 : data.event) === "payment_link.paid") {
                const orderItems = yield prisma.orderItem.findMany({
                    where: { orderId: orderId },
                });
                for (const item of orderItems) {
                    const inventory = yield prisma.inventory.findUnique({
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
                    const newQuantity = ((_d = inventory.quantity) !== null && _d !== void 0 ? _d : 0) - item.quantity;
                    const newSoldQuantity = ((_e = inventory.soldQuantity) !== null && _e !== void 0 ? _e : 0) + item.quantity;
                    const newMaxQuantity = ((_f = inventory.maxQuantity) !== null && _f !== void 0 ? _f : 0) - item.quantity;
                    let newMinQuantity = (_g = inventory.minQuantity) !== null && _g !== void 0 ? _g : 0;
                    if (newMinQuantity > newMaxQuantity) {
                        newMinQuantity = newMaxQuantity - 1;
                    }
                    let updatedQuantity = newQuantity < 0 ? 0 : newQuantity;
                    let updatedSoldQuantity = newSoldQuantity < 0 ? 0 : newSoldQuantity;
                    let updatedMaxQuantity = newMaxQuantity < 0 ? 0 : newMaxQuantity;
                    let updatedMinQuantity = newMinQuantity < 0 ? 0 : newMinQuantity;
                    yield prisma.inventory.update({
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
                    if (item === null || item === void 0 ? void 0 : item.cartId) {
                        cartdata = yield prisma.cart.findFirst({
                            where: { id: item === null || item === void 0 ? void 0 : item.cartId },
                        });
                    }
                    if (cartdata && (item === null || item === void 0 ? void 0 : item.cartId)) {
                        yield prisma.cart.delete({
                            where: { id: item === null || item === void 0 ? void 0 : item.cartId },
                        });
                    }
                    switch (item.sizeOption) {
                        case "flat":
                            if (cartdata === null || cartdata === void 0 ? void 0 : cartdata.flatId) {
                                const flatInventory = yield prisma.inventoryFlat.findUnique({
                                    where: {
                                        id: cartdata === null || cartdata === void 0 ? void 0 : cartdata.flatId,
                                    },
                                });
                                const newQuantity = ((_h = flatInventory === null || flatInventory === void 0 ? void 0 : flatInventory.quantity) !== null && _h !== void 0 ? _h : 0) - item.quantity;
                                const newSoldQuantity = ((_j = flatInventory === null || flatInventory === void 0 ? void 0 : flatInventory.soldQuantity) !== null && _j !== void 0 ? _j : 0) + item.quantity;
                                const newMaxQuantity = ((_k = flatInventory === null || flatInventory === void 0 ? void 0 : flatInventory.maxQuantity) !== null && _k !== void 0 ? _k : 0) - item.quantity;
                                let newMinQuantity = (_l = flatInventory === null || flatInventory === void 0 ? void 0 : flatInventory.minQuantity) !== null && _l !== void 0 ? _l : 0;
                                if (newMinQuantity > newMaxQuantity) {
                                    newMinQuantity = newMaxQuantity - 1;
                                }
                                let updatedQuantity = newQuantity < 0 ? 0 : newQuantity;
                                let updatedSoldQuantity = newSoldQuantity < 0 ? 0 : newSoldQuantity;
                                let updatedMaxQuantity = newMaxQuantity < 0 ? 0 : newMaxQuantity;
                                let updatedMinQuantity = newMinQuantity < 0 ? 0 : newMinQuantity;
                                if (flatInventory) {
                                    yield prisma.inventoryFlat.update({
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
                            if (cartdata === null || cartdata === void 0 ? void 0 : cartdata.fittedId) {
                                const fittedInventory = yield prisma.inventoryFitted.findUnique({
                                    where: {
                                        id: cartdata === null || cartdata === void 0 ? void 0 : cartdata.fittedId,
                                    },
                                });
                                const newQuantity = ((_m = fittedInventory === null || fittedInventory === void 0 ? void 0 : fittedInventory.quantity) !== null && _m !== void 0 ? _m : 0) - item.quantity;
                                const newSoldQuantity = ((_o = fittedInventory === null || fittedInventory === void 0 ? void 0 : fittedInventory.soldQuantity) !== null && _o !== void 0 ? _o : 0) + item.quantity;
                                const newMaxQuantity = ((_p = fittedInventory === null || fittedInventory === void 0 ? void 0 : fittedInventory.maxQuantity) !== null && _p !== void 0 ? _p : 0) - item.quantity;
                                let newMinQuantity = (_q = fittedInventory === null || fittedInventory === void 0 ? void 0 : fittedInventory.minQuantity) !== null && _q !== void 0 ? _q : 0;
                                if (newMinQuantity > newMaxQuantity) {
                                    newMinQuantity = newMaxQuantity - 1;
                                }
                                let updatedQuantity = newQuantity < 0 ? 0 : newQuantity;
                                let updatedSoldQuantity = newSoldQuantity < 0 ? 0 : newSoldQuantity;
                                let updatedMaxQuantity = newMaxQuantity < 0 ? 0 : newMaxQuantity;
                                let updatedMinQuantity = newMinQuantity < 0 ? 0 : newMinQuantity;
                                if (fittedInventory) {
                                    yield prisma.inventoryFitted.update({
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
                            if (cartdata === null || cartdata === void 0 ? void 0 : cartdata.customId) {
                                const customInventory = yield prisma.customFittedInventory.findUnique({
                                    where: {
                                        id: cartdata === null || cartdata === void 0 ? void 0 : cartdata.customId,
                                    },
                                });
                                if (customInventory === null || customInventory === void 0 ? void 0 : customInventory.inventoryFlatId) {
                                    const finalCustomInventory = yield prisma.inventoryFlat.findUnique({
                                        where: {
                                            id: customInventory === null || customInventory === void 0 ? void 0 : customInventory.inventoryFlatId,
                                        },
                                    });
                                    const newQuantity = ((_r = finalCustomInventory === null || finalCustomInventory === void 0 ? void 0 : finalCustomInventory.quantity) !== null && _r !== void 0 ? _r : 0) - item.quantity;
                                    const newSoldQuantity = ((_s = finalCustomInventory === null || finalCustomInventory === void 0 ? void 0 : finalCustomInventory.soldQuantity) !== null && _s !== void 0 ? _s : 0) + item.quantity;
                                    const newMaxQuantity = ((_t = finalCustomInventory === null || finalCustomInventory === void 0 ? void 0 : finalCustomInventory.maxQuantity) !== null && _t !== void 0 ? _t : 0) - item.quantity;
                                    let newMinQuantity = (_u = finalCustomInventory === null || finalCustomInventory === void 0 ? void 0 : finalCustomInventory.minQuantity) !== null && _u !== void 0 ? _u : 0;
                                    if (newMinQuantity > newMaxQuantity) {
                                        newMinQuantity = newMaxQuantity - 1;
                                    }
                                    let updatedQuantity = newQuantity < 0 ? 0 : newQuantity;
                                    let updatedSoldQuantity = newSoldQuantity < 0 ? 0 : newSoldQuantity;
                                    let updatedMaxQuantity = newMaxQuantity < 0 ? 0 : newMaxQuantity;
                                    let updatedMinQuantity = newMinQuantity < 0 ? 0 : newMinQuantity;
                                    if (finalCustomInventory) {
                                        yield prisma.inventoryFlat.update({
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
                yield prisma.order.update({
                    where: { id: orderId },
                    data: {
                        status: "success",
                        paymentStatus: "paid",
                    },
                });
            }
            if ((data === null || data === void 0 ? void 0 : data.event) === "payment_link.expired") {
                yield prisma.order.update({
                    where: { id: orderId },
                    data: {
                        status: "failed",
                        paymentStatus: "failed",
                    },
                });
            }
        }
        catch (error) {
            console.error("Error processing webhook:", error);
            // Handle the error appropriately, e.g., log it, send notifications, etc.
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
exports.razorPayWebhookService = razorPayWebhookService;
