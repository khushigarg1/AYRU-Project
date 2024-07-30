"use strict";
// authService.js
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
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const errors_1 = require("../errors");
const prisma = new client_1.PrismaClient();
const SALT_ROUNDS = 10;
const OTP_EXPIRATION = parseInt(process.env.OTP_EXPIRATION || "10");
const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET || "your-secret";
const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME || "1h";
class AdminAuthServices {
    // /-------------------------------------------SIGNUP ADMIN---------------------------------------
    signupAdmin(email, password, phoneNumber, 
    // adminCode: string,
    name, isActive) {
        return __awaiter(this, void 0, void 0, function* () {
            let admin = yield prisma.admin.findUnique({ where: { email } });
            if (admin) {
                throw new errors_1.ApiBadRequestError("Admin is already created. Please login");
            }
            // if (adminCode != process.env.ADMIN_CODE) {
            //   throw new ApiUnauthorizedError("Invalid admin code");
            // }
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            admin = yield prisma.admin.create({
                data: {
                    email,
                    name,
                    isActive,
                    hashedPassword,
                    role: "admin",
                    phoneNumber,
                },
            });
            return admin;
        });
    }
    // /-------------------------------------------EDIT ADMIN DETAILS---------------------------------------
    editAdminDetails(email, password, phoneNumber, adminCode, name, isActive) {
        return __awaiter(this, void 0, void 0, function* () {
            let admin = yield prisma.admin.findUnique({ where: { email } });
            if (!admin) {
                throw new errors_1.ApiBadRequestError("Admin is not created. Please signup");
            }
            if (adminCode != process.env.ADMIN_CODE) {
                throw new errors_1.ApiUnauthorizedError("Invalid admin code");
            }
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            admin = yield prisma.admin.update({
                where: { email: email },
                data: {
                    email,
                    name,
                    isActive,
                    hashedPassword,
                    role: "admin",
                    phoneNumber,
                },
            });
            return admin;
        });
    }
    // /-------------------------------------------LOGIN ADMIN---------------------------------------
    loginAdmin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield prisma.admin.findUnique({ where: { email } });
            if (!admin) {
                throw new errors_1.ApiUnauthorizedError("Admin is not created. Please signup");
            }
            const isMatch = yield bcrypt_1.default.compare(password, admin.hashedPassword);
            return {
                admin,
                isMatch,
                message: isMatch
                    ? "Login successful"
                    : "Given email/password combination is invalid",
            };
        });
    }
    // /-------------------------------------------CHANGE ADMIN PASSWORD---------------------------------------
    changeAdminPassword(email, currentPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield prisma.admin.findUnique({ where: { email: email } });
            if (!admin) {
                throw new Error("Admin not found");
            }
            const isMatch = yield bcrypt_1.default.compare(currentPassword, admin.hashedPassword);
            if (!isMatch) {
                throw new Error("Invalid current password");
            }
            const hash = yield bcrypt_1.default.hash(newPassword, SALT_ROUNDS);
            const updatedAdmin = yield prisma.admin.update({
                where: { email: email },
                data: { hashedPassword: hash },
            });
            return updatedAdmin;
        });
    }
    // /-------------------------------------------GET ALL ADMIN---------------------------------------
    getAdmins() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.admin.findMany({
                orderBy: {
                    updatedAt: "desc",
                },
            });
        });
    }
    // /-------------------------------------------GET ADMIN BY ID---------------------------------------
    getAdminById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.admin.findUnique({ where: { id } });
        });
    }
}
exports.default = new AdminAuthServices();
