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
exports.razorPayWebhook = exports.deleteOrder = exports.updateOrder = exports.getOrders = exports.getOrderbyAdminId = exports.getOrderbyId = exports.getOrder = exports.createOrder = void 0;
const order_service_1 = require("../Services/order.service");
const crypto_1 = __importDefault(require("crypto"));
// Create Order
function createOrder(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { token } = request.query;
        if (!token) {
            return reply.code(400).send({ message: "Token is required" });
        }
        const secretKey = process.env.JWT_TOKEN_SECRET;
        const decoded = server.jwt.verify(token);
        if (!decoded || !decoded.id || !decoded.email) {
            throw new Error("Invalid token or missing data");
        }
        try {
            const newOrder = yield (0, order_service_1.createOrderService)(request.body, decoded === null || decoded === void 0 ? void 0 : decoded.id);
            return reply.code(201).send(newOrder);
        }
        catch (error) {
            return reply.code(500).send(error);
        }
    });
}
exports.createOrder = createOrder;
// Get Single Order
function getOrder(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.user;
            const order = yield (0, order_service_1.getOrderService)(Number(id));
            if (order) {
                return reply.code(200).send(order);
            }
            return reply.code(404).send({ message: "Order not found" });
        }
        catch (error) {
            return reply.code(500).send(error);
        }
    });
}
exports.getOrder = getOrder;
// Get order by id
function getOrderbyId(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id: userId } = request.user;
            const { id: orderId } = request.params;
            const order = yield (0, order_service_1.getOrderByIdService)(Number(orderId), Number(userId));
            if (order) {
                return reply.code(200).send(order);
            }
            return reply.code(404).send({ message: "Order not found" });
        }
        catch (error) {
            return reply.code(500).send(error);
        }
    });
}
exports.getOrderbyId = getOrderbyId;
function getOrderbyAdminId(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id: orderId } = request.params;
            const order = yield (0, order_service_1.getOrderByAdminIdService)(Number(orderId));
            if (order) {
                return reply.code(200).send(order);
            }
            return reply.code(404).send({ message: "Order not found" });
        }
        catch (error) {
            return reply.code(500).send(error);
        }
    });
}
exports.getOrderbyAdminId = getOrderbyAdminId;
// Get All Orders
function getOrders(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const orders = yield (0, order_service_1.getOrdersService)();
            return reply.code(200).send(orders);
        }
        catch (error) {
            return reply.code(500).send(error);
        }
    });
}
exports.getOrders = getOrders;
// Update Order
function updateOrder(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            const updatedOrder = yield (0, order_service_1.updateOrderService)(parseInt(id, 10), request.body);
            if (updatedOrder) {
                return reply.code(200).send(updatedOrder);
            }
            return reply.code(404).send({ message: "Order not found" });
        }
        catch (error) {
            return reply.code(500).send(error);
        }
    });
}
exports.updateOrder = updateOrder;
// Delete Order
function deleteOrder(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            const deleted = yield (0, order_service_1.deleteOrderService)(parseInt(id, 10));
            if (deleted) {
                return reply.code(200).send({ message: "Order deleted successfully" });
            }
            return reply.code(404).send({ message: "Order not found" });
        }
        catch (error) {
            return reply.code(500).send(error);
        }
    });
}
exports.deleteOrder = deleteOrder;
function razorPayWebhook(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const RAZORPAY_WEBHOOK_SECRET = process.env
                .RAZOR_PAY_WEBHOOK_SECRET;
            const razorpaySignature = request.headers["x-razorpay-signature"];
            const payload = JSON.stringify(request.body);
            const expectedSignature = crypto_1.default
                .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
                .update(payload)
                .digest("hex");
            if (expectedSignature === razorpaySignature) {
                const deleted = yield (0, order_service_1.razorPayWebhookService)(request.body);
                return reply.status(200).send("Webhook verified");
            }
            else {
                return reply.status(400).send("Invalid signature");
            }
        }
        catch (error) {
            return reply.code(500).send(error);
        }
    });
}
exports.razorPayWebhook = razorPayWebhook;
