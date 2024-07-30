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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authMiddleware(server) {
    return __awaiter(this, void 0, void 0, function* () {
        // User Authentication Middleware
        server.decorate("authenticateUser", function (request, reply) {
            return __awaiter(this, void 0, void 0, function* () {
                const authHeader = request.headers.authorization;
                if (!authHeader) {
                    return reply
                        .code(401)
                        .send({ message: "Authorization header missing" });
                }
                const token = authHeader.split(" ")[1];
                if (!token) {
                    return reply.code(401).send({ message: "Token not found" });
                }
                try {
                    const secretKey = process.env.JWT_TOKEN_SECRET;
                    if (!secretKey) {
                        throw new Error("JWT secret key not configured");
                    }
                    const decoded = jsonwebtoken_1.default.verify(token, secretKey);
                    if (decoded.role !== "user") {
                        throw new Error("Access denied. Not a user.");
                    }
                    request.user = decoded;
                }
                catch (err) {
                    return reply.code(401).send({ message: err.message });
                }
            });
        });
        // Admin Authentication Middleware
        server.decorate("authenticateAdmin", function (request, reply) {
            return __awaiter(this, void 0, void 0, function* () {
                const authHeader = request.headers.authorization;
                if (!authHeader) {
                    return reply
                        .code(401)
                        .send({ message: "Authorization header missing" });
                }
                const token = authHeader.split(" ")[1];
                if (!token) {
                    return reply.code(401).send({ message: "Token not found" });
                }
                try {
                    const secretKey = process.env.JWT_TOKEN_SECRET;
                    if (!secretKey) {
                        throw new Error("JWT secret key not configured");
                    }
                    const decoded = jsonwebtoken_1.default.verify(token, secretKey);
                    if (decoded.role !== "admin") {
                        throw new Error("Access denied. Not an admin.");
                    }
                    request.user = decoded;
                }
                catch (err) {
                    return reply.code(401).send({ message: err.message });
                }
            });
        });
        // Routes to validate tokens
        server.get("/validate/admin", { onRequest: [server.authenticateAdmin] }, (request, reply) => __awaiter(this, void 0, void 0, function* () {
            return request.user;
        }));
        server.get("/validate/user", { onRequest: [server.authenticateUser] }, (request, reply) => __awaiter(this, void 0, void 0, function* () {
            return request.user;
        }));
    });
}
exports.default = authMiddleware;
