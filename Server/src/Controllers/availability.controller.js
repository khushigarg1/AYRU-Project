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
exports.checkExpiredRequests = exports.updateAvailabilityRequest = exports.getAllAvailability = exports.getAvailability = exports.getAvailabilityCheck = exports.createAvailabilityRequest = void 0;
const availability_service_js_1 = require("../Services/availability.service.js");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const availabilityService = new availability_service_js_1.AvailabilityService();
function createAvailabilityRequest(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id: userId } = request === null || request === void 0 ? void 0 : request.user;
        const { inventoryid, mobilenumber } = request.body;
        try {
            const availabilityRequest = yield availabilityService.createAvailabilityRequest(Number(userId), inventoryid, mobilenumber);
            // Send WhatsApp message to admin and user here
            return reply.status(201).send(availabilityRequest);
        }
        catch (error) {
            console.error(error);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    });
}
exports.createAvailabilityRequest = createAvailabilityRequest;
function getAvailabilityCheck(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id: userId } = request.user;
        const { id } = request.params;
        try {
            const availabilityRequest = yield prisma.availabilityRequest.findFirst({
                where: {
                    userId: Number(userId),
                    inventoryid: Number(id),
                },
            });
            if (!availabilityRequest) {
                return reply
                    .status(404)
                    .send({ error: "Availability request not found" });
            }
            return reply.status(200).send({ data: availabilityRequest });
        }
        catch (error) {
            console.error(error);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    });
}
exports.getAvailabilityCheck = getAvailabilityCheck;
function getAvailability(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = request.params;
        try {
            const availabilityRequest = yield prisma.availabilityRequest.findUnique({
                where: {
                    id: Number(id),
                },
                include: {
                    user: true,
                    inventory: {
                        include: {
                            customFittedInventory: {
                                include: { InventoryFlat: { include: { Flat: true } } },
                            },
                            InventoryFlat: { include: { Flat: true } },
                            InventorySubcategory: { include: { SubCategory: true } },
                            InventoryFitted: {
                                include: { Fitted: true },
                            },
                            Category: true,
                            Wishlist: true,
                            ColorVariations: { include: { Color: true } },
                            relatedInventories: { include: { Media: true } },
                            relatedByInventories: { include: { Media: true } },
                            Media: true,
                            SizeChartMedia: true,
                        },
                    },
                },
            });
            if (!availabilityRequest) {
                return reply
                    .status(404)
                    .send({ error: "Availability request not found" });
            }
            return reply.status(200).send({ data: availabilityRequest });
        }
        catch (error) {
            console.error(error);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    });
}
exports.getAvailability = getAvailability;
function getAllAvailability(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const availabilityRequests = yield prisma.availabilityRequest.findMany({
                include: {
                    user: true,
                    inventory: {
                        include: {
                            customFittedInventory: {
                                include: { InventoryFlat: { include: { Flat: true } } },
                            },
                            InventoryFlat: { include: { Flat: true } },
                            InventorySubcategory: { include: { SubCategory: true } },
                            InventoryFitted: {
                                include: { Fitted: true },
                            },
                            Category: true,
                            Wishlist: true,
                            ColorVariations: { include: { Color: true } },
                            relatedInventories: { include: { Media: true } },
                            relatedByInventories: { include: { Media: true } },
                            Media: true,
                            SizeChartMedia: true,
                        },
                    },
                },
                orderBy: {
                    updatedAt: "desc",
                },
            });
            if (!availabilityRequests || availabilityRequests.length === 0) {
                return reply
                    .status(404)
                    .send({ error: "No availability requests found" });
            }
            return reply.status(200).send({ data: availabilityRequests });
        }
        catch (error) {
            console.error(error);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    });
}
exports.getAllAvailability = getAllAvailability;
function updateAvailabilityRequest(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = request.params;
        const { status } = request.body;
        try {
            const availabilityRequest = yield availabilityService.updateAvailabilityRequest(Number(id), status);
            return reply.status(200).send(availabilityRequest);
        }
        catch (error) {
            console.error(error);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    });
}
exports.updateAvailabilityRequest = updateAvailabilityRequest;
function checkExpiredRequests(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const now = new Date();
        const fortyTwoHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
        console.log(fortyTwoHoursAgo);
        try {
            const expiredRequests = yield prisma.availabilityRequest.findMany({
                where: {
                    status: "pending",
                    updatedAt: { lte: fortyTwoHoursAgo },
                },
            });
            for (const request of expiredRequests) {
                yield prisma.availabilityRequest.update({
                    where: { id: request.id },
                    data: { status: "rejected" },
                });
            }
            return reply.status(200).send({
                message: "Expired requests checked and updated successfully",
                updatedRequests: expiredRequests.length,
            });
        }
        catch (error) {
            console.error("Error checking expired requests:", error);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    });
}
exports.checkExpiredRequests = checkExpiredRequests;
