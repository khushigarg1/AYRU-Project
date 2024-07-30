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
exports.getUser = exports.getAllUsers = exports.confirmEmailChange = exports.requestEmailChange = exports.userLogin = exports.setPassword = exports.verifyPhoneOTP = exports.sendPhoneOTP = exports.verifyEmailOTP = exports.sendEmailOTP = void 0;
const client_1 = require("@prisma/client");
const userAuth_service_1 = __importDefault(require("../Services/userAuth.service"));
// import {
//   CreateUser,
//   CreateAdmin,
//   LoginUser,
//   LoginAdmin,
// } from "../schema/auth.schema";
const errors_1 = require("../errors");
const prisma = new client_1.PrismaClient();
const SALT_ROUNDS = 10;
// /-------------------------------------------SEND OTP AT EMAIL---------------------------------------
function sendEmailOTP(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, role } = request.body;
        try {
            const response = yield userAuth_service_1.default.sendEmailOTP(email, role);
            reply.send(response);
        }
        catch (error) {
            reply.code(400).send({ message: error.message });
        }
    });
}
exports.sendEmailOTP = sendEmailOTP;
// /-------------------------------------------VERIFY EMAIL OTP---------------------------------------
function verifyEmailOTP(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, OTP, role } = request.body;
        try {
            const [success, user] = yield userAuth_service_1.default.verifyEmailOTP(server, email, OTP, role);
            if (success) {
                reply.send(user);
            }
            else {
                reply.code(400).send({ message: "Invalid OTP" });
            }
        }
        catch (error) {
            reply.code(400).send({ message: error.message });
        }
    });
}
exports.verifyEmailOTP = verifyEmailOTP;
// /-------------------------------------------SEND OTP AT PHONE---------------------------------------
function sendPhoneOTP(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, phoneNumber, role } = request.body;
        try {
            const response = yield userAuth_service_1.default.sendPhoneOTP(email, phoneNumber, role);
            reply.send(response);
        }
        catch (error) {
            reply.code(400).send({ message: error.message });
        }
    });
}
exports.sendPhoneOTP = sendPhoneOTP;
// /-------------------------------------------VERIFY PHONE OTP ---------------------------------------
function verifyPhoneOTP(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { phoneNumber, OTP, role } = request.body;
        try {
            const user = yield userAuth_service_1.default.verifyPhoneOTP(server, phoneNumber, OTP, role);
            reply.send(user);
        }
        catch (error) {
            reply.code(400).send({ message: error.message });
        }
    });
}
exports.verifyPhoneOTP = verifyPhoneOTP;
// /-------------------------------------------SET PASSWORD /EDIT PASSWORD---------------------------------------
function setPassword(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, role, newPassword } = request.body;
        try {
            const user = yield userAuth_service_1.default.setPassword(email, role, newPassword);
            reply.send(user);
        }
        catch (error) {
            reply.code(400).send({ message: error.message });
        }
    });
}
exports.setPassword = setPassword;
// /-------------------------------------------USER LOGIN---------------------------------------
function userLogin(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = request.body;
        const { user, isMatch, message } = yield userAuth_service_1.default.loginUser(email, password);
        if (!user || !isMatch) {
            // return reply.code(401).send({ message });
            throw new errors_1.ApiUnauthorizedError(message);
        }
        const payload = {
            id: user === null || user === void 0 ? void 0 : user.id,
            email: user === null || user === void 0 ? void 0 : user.email,
            phoneNumber: user === null || user === void 0 ? void 0 : user.phoneNumber,
            role: user === null || user === void 0 ? void 0 : user.role,
            isEmailVerified: user === null || user === void 0 ? void 0 : user.isEmailVerified,
            isPhoneVerified: user === null || user === void 0 ? void 0 : user.isPhoneVerified,
        };
        const token = server.jwt.sign(payload);
        reply.send({ accessToken: token, data: user });
    });
}
exports.userLogin = userLogin;
// /-------------------------------------------REQUESTING FOR EMAIL CHANGE---------------------------------------
function requestEmailChange(server, request, reply
// user: any
) {
    return __awaiter(this, void 0, void 0, function* () {
        const { newemail } = request.body;
        // const id = user?.id;
        try {
            const response = yield userAuth_service_1.default.requestEmailChange(server, request, reply, newemail
            // id
            );
            reply.send(response);
        }
        catch (error) {
            reply.code(400).send({ message: error.message });
        }
    });
}
exports.requestEmailChange = requestEmailChange;
// /-------------------------------------------CONFIRM EMAIL CHANGE---------------------------------------
function confirmEmailChange(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { token } = request.query;
        if (!token) {
            return reply.code(400).send({ message: "Token is required" });
        }
        try {
            const secretKey = process.env.JWT_TOKEN_SECRET;
            const decoded = server.jwt.verify(token);
            if (!decoded || !decoded.id || !decoded.email) {
                throw new Error("Invalid token or missing data");
            }
            yield userAuth_service_1.default.confirmEmailChange(server, request, reply, decoded === null || decoded === void 0 ? void 0 : decoded.id, decoded.email);
        }
        catch (error) {
            reply.code(400).send({ message: error.message });
        }
    });
}
exports.confirmEmailChange = confirmEmailChange;
// /-------------------------------------------GET ALL USERS---------------------------------------
function getAllUsers(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userAuth_service_1.default.getAllUsers();
        reply.send({ data: user });
    });
}
exports.getAllUsers = getAllUsers;
function getUser(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { id } = request.params;
        if (id != ((_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.id)) {
            throw new errors_1.ApiUnauthorizedError("Access denied for the requested user.");
        }
        const user = yield userAuth_service_1.default.getUserById(Number(id));
        if (!user) {
            reply.code(404).send({ message: "User not found" });
        }
        else {
            reply.send({ data: user });
        }
    });
}
exports.getUser = getUser;
