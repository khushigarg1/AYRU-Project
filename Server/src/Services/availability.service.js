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
exports.AvailabilityService = void 0;
// src/services/availabilityService.ts
const client_1 = require("@prisma/client");
const mail_1 = require("./mail");
const prisma = new client_1.PrismaClient();
class AvailabilityService {
    createAvailabilityRequest(userId, inventoryid, mobilenumber) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield prisma.availabilityRequest.deleteMany({
                where: {
                    userId,
                    inventoryid,
                },
            });
            const availabilityRequest = yield prisma.availabilityRequest.create({
                data: {
                    userId,
                    inventoryid,
                    mobilenumber,
                    status: "pending",
                },
            });
            const inventory = yield prisma.inventory.findFirst({
                where: {
                    id: inventoryid,
                },
                include: {
                    Category: true,
                },
            });
            const userDetails = yield prisma.user.findFirst({
                where: {
                    id: userId,
                },
            });
            // Send email notification to admin
            const to = "ayrujaipur@gmail.com";
            const subject = "New Availability Request";
            const body = `
      <div class="container">
        <h1>New Availability Request</h1>
        <p>User with ID: ${userId} has requested to check the availability of inventory item with ID: ${inventoryid}.</p>
        <p>Product Name: ${inventory === null || inventory === void 0 ? void 0 : inventory.productName}</p>
        <p>Product category: ${(_a = inventory === null || inventory === void 0 ? void 0 : inventory.Category) === null || _a === void 0 ? void 0 : _a.categoryName}</p>
        <p>${process.env.ADMIN_URL}/availability/${availabilityRequest === null || availabilityRequest === void 0 ? void 0 : availabilityRequest.id}</p>
        <p>User's mobile number: ${mobilenumber}</p>
        <p>User's email: ${userDetails === null || userDetails === void 0 ? void 0 : userDetails.email}</p>
      </div>
    `;
            yield (0, mail_1.sendEmail)(to, subject, body);
            return availabilityRequest;
        });
    }
    updateAvailabilityRequest(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.availabilityRequest.update({
                where: { id },
                data: {
                    status,
                },
            });
        });
    }
}
exports.AvailabilityService = AvailabilityService;
