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
const wishlist_controller_1 = require("../Controllers/wishlist.controller");
function WishlistRoutes(server) {
    return __awaiter(this, void 0, void 0, function* () {
        server.get("/", { onRequest: [server === null || server === void 0 ? void 0 : server.authenticateAdmin] }, wishlist_controller_1.getAllWishlists);
        server.get("/user/:userId", { onRequest: [server === null || server === void 0 ? void 0 : server.authenticateUser] }, wishlist_controller_1.getWishlistByUserId);
        server.post("/", { onRequest: [server === null || server === void 0 ? void 0 : server.authenticateUser] }, (request, reply) => (0, wishlist_controller_1.addToWishlist)(server, request, reply));
        server.delete("/:wishlistId", { onRequest: [server === null || server === void 0 ? void 0 : server.authenticateUser] }, wishlist_controller_1.deleteWishlist);
    });
}
exports.default = WishlistRoutes;
