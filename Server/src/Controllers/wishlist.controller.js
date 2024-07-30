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
exports.deleteWishlist = exports.getWishlistByUserId = exports.getAllWishlists = exports.addToWishlist = void 0;
const client_1 = require("@prisma/client");
const wishlist_service_1 = require("../Services/wishlist.service");
const errors_1 = require("../errors");
const prisma = new client_1.PrismaClient();
const wishlistService = new wishlist_service_1.WishlistService();
function addToWishlist(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = request.body;
            if (userId != request.user.id) {
                throw new errors_1.ApiUnauthorizedError("Access denied for the requested user.");
            }
            const wishlistItem = yield wishlistService.addToWishlist(request.body);
            reply.code(201).send({ success: true, data: wishlistItem });
        }
        catch (error) {
            reply.code(500).send({ success: false, error: error });
        }
    });
}
exports.addToWishlist = addToWishlist;
function getAllWishlists(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const wishlists = yield wishlistService.getAllWishlists();
            reply.code(200).send({ success: true, data: wishlists });
        }
        catch (error) {
            reply.code(500).send({ success: false, error: error });
        }
    });
}
exports.getAllWishlists = getAllWishlists;
function getWishlistByUserId(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { userId } = request.params;
        if (userId != ((_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.id)) {
            throw new errors_1.ApiUnauthorizedError("Access denied for the requested user.");
        }
        try {
            const wishlists = yield wishlistService.getWishlistByUserId(Number(userId));
            reply.code(200).send({ success: true, data: wishlists });
        }
        catch (error) {
            reply.code(500).send({ success: false, error: error });
        }
    });
}
exports.getWishlistByUserId = getWishlistByUserId;
function deleteWishlist(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { wishlistId } = request.params;
        try {
            const wishlistItem = yield wishlistService.getWishlistById(Number(wishlistId));
            if (wishlistItem.userId !== request.user.id) {
                throw new errors_1.ApiUnauthorizedError("Access denied for the requested user.");
            }
            yield wishlistService.deleteWishlist(Number(wishlistId));
            reply
                .code(200)
                .send({ success: true, message: "Wishlist item deleted successfully" });
        }
        catch (error) {
            reply.code(500).send({ success: false, error: error });
        }
    });
}
exports.deleteWishlist = deleteWishlist;
