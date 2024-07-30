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
exports.getFirstAdmin = exports.getAdmin = exports.getAllAdmins = exports.changeAdminPasswordHandler = exports.adminLogin = exports.editAdminDetails = exports.adminSignup = void 0;
const client_1 = require("@prisma/client");
const adminAuth_service_1 = __importDefault(require("../Services/adminAuth.service"));
const errors_1 = require("../errors");
const prisma = new client_1.PrismaClient();
const SALT_ROUNDS = 10;
// /-------------------------------------------SIGNUP ADMIN---------------------------------------
function adminSignup(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password, phoneNumber, 
        //  adminCode,
        name, isActive, } = request.body;
        try {
            const admin = yield adminAuth_service_1.default.signupAdmin(email, password, phoneNumber, 
            // adminCode,
            name, isActive);
            reply.code(201).send({ message: "Admin signup successful", data: admin });
        }
        catch (error) {
            reply.code(400).send({ message: error.message });
        }
    });
}
exports.adminSignup = adminSignup;
// /-------------------------------------------EDIT ADMIN DETAILS---------------------------------------
function editAdminDetails(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password, phoneNumber, adminCode, name, isActive } = request.body;
        try {
            const admin = yield adminAuth_service_1.default.editAdminDetails(email, password, phoneNumber, adminCode, name, isActive);
            reply
                .code(201)
                .send({ message: "Admin details edited successful", data: admin });
        }
        catch (error) {
            reply.code(400).send({ message: error.message });
        }
    });
}
exports.editAdminDetails = editAdminDetails;
// /-------------------------------------------ADMIN LOGIN---------------------------------------
function adminLogin(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = request.body;
        try {
            const { admin, isMatch, message } = yield adminAuth_service_1.default.loginAdmin(email, password);
            if (!admin || !isMatch) {
                return reply.code(401).send({ message: message });
            }
            const payload = {
                id: admin.id,
                email: admin.email,
                role: admin.role,
                phoneNumber: admin.phoneNumber,
            };
            const token = server.jwt.sign(payload);
            reply.send({ message: message, accessToken: token, data: admin });
        }
        catch (error) {
            reply.code(400).send({ message: error.message });
        }
    });
}
exports.adminLogin = adminLogin;
// /-------------------------------------------CHANGE ADMIN PASSWORD---------------------------------------
function changeAdminPasswordHandler(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, currentPassword, newPassword } = request.body;
        try {
            const updatedAdmin = yield adminAuth_service_1.default.changeAdminPassword(email, currentPassword, newPassword);
            reply.send({
                message: "Password changed successfully",
                admin: updatedAdmin,
            });
        }
        catch (error) {
            reply.code(400).send({ message: error.message });
        }
    });
}
exports.changeAdminPasswordHandler = changeAdminPasswordHandler;
function getAllAdmins(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const admins = yield adminAuth_service_1.default.getAdmins();
        reply.send({ data: admins });
    });
}
exports.getAllAdmins = getAllAdmins;
function getAdmin(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { id } = request.params;
        if (id != ((_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.id)) {
            throw new errors_1.ApiUnauthorizedError("Access denied for the requested user.");
        }
        const admin = yield adminAuth_service_1.default.getAdminById(Number(id));
        if (!admin) {
            reply.code(404).send({ message: "Admin is not created. Please signup" });
        }
        else {
            reply.send({ data: admin });
        }
    });
}
exports.getAdmin = getAdmin;
function getFirstAdmin(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const admin = yield adminAuth_service_1.default.getAdminById(Number(1));
        if (!admin) {
            reply.code(404).send({ message: "Admin is not created. Please signup" });
        }
        else {
            reply.send({ data: admin });
        }
    });
}
exports.getFirstAdmin = getFirstAdmin;
