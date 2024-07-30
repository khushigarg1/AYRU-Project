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
exports.getAllCart = exports.getCart = exports.updateCart = exports.removeFromCart = exports.addToCart = void 0;
const cart_service_1 = require("../Services/cart.service");
const errors_1 = require("../errors");
const cartService = new cart_service_1.CartService();
function addToCart(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = request === null || request === void 0 ? void 0 : request.user;
        const { inventoryId, quantity, flatId, fittedId, customId, sellingPrice, costPrice, discountedPrice, sizeOption, selectedFlatItem, selectedFittedItem, selectedCustomFittedItem, unit, length, width, height, remark, } = request.body;
        try {
            const cartItem = yield cartService.addToCart(Number(id), inventoryId, quantity, flatId, fittedId, customId, sellingPrice, costPrice, discountedPrice, sizeOption, selectedFlatItem, selectedFittedItem, selectedCustomFittedItem, unit, length, width, height, remark);
            reply.code(201).send({ success: true, data: cartItem });
        }
        catch (error) {
            if (error instanceof errors_1.ApiBadRequestError || error instanceof errors_1.Api404Error) {
                reply.code(400).send({ success: false, error: error.message });
            }
            else {
                reply.code(500).send({ success: false, error: "Internal Server Error" });
            }
        }
    });
}
exports.addToCart = addToCart;
function removeFromCart(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = request.user;
        const { id: cartItemId } = request.params;
        try {
            yield cartService.removeFromCart(Number(id), parseInt(cartItemId));
            reply
                .code(200)
                .send({ success: true, message: "Cart item deleted successfully" });
        }
        catch (error) {
            if (error instanceof errors_1.ApiBadRequestError || error instanceof errors_1.Api404Error) {
                reply.code(400).send({ success: false, error: error.message });
            }
            else {
                reply.code(500).send({ success: false, error: "Internal Server Error" });
            }
        }
    });
}
exports.removeFromCart = removeFromCart;
function updateCart(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = request.user;
        const { cartItemId } = request.params;
        const { quantity, 
        // flatId,
        // fittedId,
        // customId,
        sizeOption, selectedFlatItem, selectedFittedItem, selectedCustomFittedItem, unit, length, width, height, remark, } = request.body;
        try {
            const updatedCartItem = yield cartService.updateCart(Number(id), parseInt(cartItemId), quantity, 
            // flatId,
            // fittedId,
            // customId,
            sizeOption, selectedFlatItem, selectedFittedItem, selectedCustomFittedItem, unit, length, width, height, remark);
            reply.code(200).send({ success: true, data: updatedCartItem });
        }
        catch (error) {
            if (error instanceof errors_1.ApiBadRequestError || error instanceof errors_1.Api404Error) {
                reply.code(400).send({ success: false, error: error.message });
            }
            else {
                reply.code(500).send({ success: false, error: "Internal Server Error" });
            }
        }
    });
}
exports.updateCart = updateCart;
function getCart(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = request.user;
        try {
            const userCart = yield cartService.getUserCart(Number(id));
            reply.code(200).send({ success: true, data: userCart });
        }
        catch (error) {
            if (error instanceof errors_1.ApiBadRequestError || error instanceof errors_1.Api404Error) {
                reply.code(400).send({ success: false, error: error.message });
            }
            else {
                reply.code(500).send({ success: false, error: "Internal Server Error" });
            }
        }
    });
}
exports.getCart = getCart;
function getAllCart(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userCart = yield cartService.getAllCart();
            reply.code(200).send({ success: true, data: userCart });
        }
        catch (error) {
            if (error instanceof errors_1.ApiBadRequestError || error instanceof errors_1.Api404Error) {
                reply.code(400).send({ success: false, error: error.message });
            }
            else {
                reply.code(500).send({ success: false, error: "Internal Server Error" });
            }
        }
    });
}
exports.getAllCart = getAllCart;
