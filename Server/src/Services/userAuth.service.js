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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mail_1 = require("./mail");
const utils_1 = require("../utils/utils");
const errors_1 = require("../errors");
const logger_1 = require("../logger");
const prisma = new client_1.PrismaClient();
const SALT_ROUNDS = 10;
const OTP_EXPIRATION = parseInt(process.env.OTP_EXPIRATION || "10");
const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET || "your-secret";
const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME || "1h";
class UserAuthServices {
    ///-------------------------------------------SEND EMAIL OTP-----------------------------------------
    sendEmailOTP(email, role) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email || !role) {
                throw new errors_1.ApiBadRequestError("Please provide the necessary details properly.");
            }
            let otp = (0, utils_1.generateRandomNumber)(1000, 9999).toString();
            let expirationTime = new Date(Date.now() + 60000 * OTP_EXPIRATION);
            let existingUser = yield prisma.userAuthentication.findFirst({
                where: { email },
            });
            if (!existingUser) {
                existingUser = yield prisma.userAuthentication.create({
                    data: {
                        email,
                        emailOtp: otp,
                        emailExpirationTime: expirationTime,
                        isEmailVerified: false,
                    },
                });
            }
            else {
                existingUser = yield prisma.userAuthentication.update({
                    where: { id: existingUser.id },
                    data: {
                        emailOtp: otp,
                        emailExpirationTime: expirationTime,
                        isEmailVerified: false,
                    },
                });
                let checkUser = yield prisma.user.findFirst({
                    where: { userAuthenticationId: existingUser === null || existingUser === void 0 ? void 0 : existingUser.id },
                });
                if (checkUser) {
                    yield prisma.user.update({
                        where: { id: checkUser === null || checkUser === void 0 ? void 0 : checkUser.id },
                        data: {
                            isEmailVerified: false,
                        },
                    });
                }
            }
            let emailResult;
            if (process.env.NODE_ENV === "production" || true) {
                emailResult = yield (0, mail_1.sendEmail)(email, "AYRU JAIPUR | OTP for Login Secure Access", `
        <div class="container">
          <h1>AYRU JAIPUR</h1>
          <p>To complete your login, please use the following One-Time Password (OTP):</p>
          <div class="otp">${otp}</div>
          <p>This OTP is valid for 5 minutes. For your security, do not share this OTP with anyone.</p>
          <p>If you did not request this OTP, please contact our support team immediately.</p>
          <div class="contact-info">
            <p>Thank you,</p>
            <p>AYRU JAIPUR</p>
            <p>+91-9785852222</p>
          </div>
        </div>
      `);
            }
            // const emailResult = true;
            if (emailResult) {
                return { message: `OTP sent to your email ${email}`, data: existingUser };
            }
            else {
                throw new errors_1.ApiInternalServerError("Failed to send email OTP");
            }
        });
    }
    ///-------------------------------------------VERIFY EMAIL OTP-----------------------------------------
    verifyEmailOTP(server, email, OTP, role) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email || !OTP || !role) {
                throw new errors_1.ApiBadRequestError("Please provide the necessary details properly.");
            }
            let checkUserAuth = yield prisma.userAuthentication.findFirst({
                where: { email },
            });
            let checkUser = yield prisma.user.findFirst({
                where: { email },
            });
            if (!checkUserAuth) {
                throw new errors_1.ApiBadRequestError("No user found with provided role, email, and phone number.");
            }
            if ((checkUserAuth === null || checkUserAuth === void 0 ? void 0 : checkUserAuth.emailExpirationTime) &&
                new Date(checkUserAuth.emailExpirationTime).getTime() <
                    new Date().getTime()) {
                throw new errors_1.ApiBadRequestError("OTP has expired");
            }
            if (checkUserAuth.emailOtp == OTP) {
                checkUserAuth = yield prisma.userAuthentication.update({
                    where: { id: checkUserAuth.id },
                    data: { isEmailVerified: true },
                });
                if (!checkUser) {
                    checkUser = yield prisma.user.create({
                        data: {
                            role,
                            email,
                            isEmailVerified: true,
                            userAuthenticationId: checkUserAuth === null || checkUserAuth === void 0 ? void 0 : checkUserAuth.id,
                        },
                    });
                }
                if (checkUser) {
                    checkUser = yield prisma.user.update({
                        where: { id: checkUser === null || checkUser === void 0 ? void 0 : checkUser.id },
                        data: {
                            isEmailVerified: true,
                        },
                    });
                }
                const payload = {
                    id: checkUser === null || checkUser === void 0 ? void 0 : checkUser.id,
                    email: checkUser === null || checkUser === void 0 ? void 0 : checkUser.email,
                    phoneNumber: checkUser === null || checkUser === void 0 ? void 0 : checkUser.phoneNumber,
                    role: checkUser === null || checkUser === void 0 ? void 0 : checkUser.role,
                    isEmailVerified: checkUser === null || checkUser === void 0 ? void 0 : checkUser.isEmailVerified,
                    isPhoneVerified: checkUser === null || checkUser === void 0 ? void 0 : checkUser.isPhoneVerified,
                };
                const token = server.jwt.sign(payload);
                return [
                    true,
                    {
                        accessToken: token,
                        message: "OTP verified",
                        data: { userdata: checkUser, userauth: checkUserAuth },
                    },
                ];
            }
            else {
                return [false];
            }
        });
    }
    ///-------------------------------------------SEND PHONE OTP-----------------------------------------
    sendPhoneOTP(email, phoneNumber, role) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email || !phoneNumber || !role) {
                throw new errors_1.ApiBadRequestError("Please provide the necessary details properly.");
            }
            let otp = (0, utils_1.generateRandomNumber)(1000, 9999).toString();
            let expirationTime = new Date(Date.now() + 60000 * OTP_EXPIRATION);
            // if user with email exists or not
            const existingUserByEmail = yield prisma.userAuthentication.findFirst({
                where: { email },
            });
            if (!existingUserByEmail) {
                throw new errors_1.ApiBadRequestError("User not found with the provided email. Please verify email first.");
            }
            // Check if the provided phone number is already in use
            const existingUserByPhoneNumber = yield prisma.userAuthentication.findFirst({
                where: { phoneNumber },
            });
            if (existingUserByPhoneNumber) {
                // Check if the user with the phone number is the same as the user with the provided email
                if (existingUserByPhoneNumber.id !== existingUserByEmail.id) {
                    throw new errors_1.ApiBadRequestError("Phone number already in use with a different email.");
                }
                if (existingUserByPhoneNumber.isPhoneVerified) {
                    const existingUser = yield prisma.user.findFirst({
                        where: { userAuthenticationId: existingUserByPhoneNumber === null || existingUserByPhoneNumber === void 0 ? void 0 : existingUserByPhoneNumber.id },
                    });
                    return {
                        message: "Phone number already in use with the same email.",
                        data: existingUser,
                    };
                }
            }
            // If email is verified, update user with phone number and OTP
            if (existingUserByEmail.isEmailVerified && !existingUserByPhoneNumber) {
                yield prisma.userAuthentication.update({
                    where: { id: existingUserByEmail === null || existingUserByEmail === void 0 ? void 0 : existingUserByEmail.id },
                    data: {
                        phoneNumber,
                        phoneOtp: otp,
                        phoneExpirationTime: expirationTime,
                        isPhoneVerified: false,
                    },
                });
                logger_1.logger.info(`SMS OTP is : ${otp}`);
                return { message: `OTP sent to your phone number ${phoneNumber}` };
            }
            else {
                throw new errors_1.ApiBadRequestError("Please verify your email first before adding a phone number.");
            }
        });
    }
    ///-------------------------------------------VERIFY PHONE OTP-----------------------------------------
    verifyPhoneOTP(server, phoneNumber, OTP, role) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!phoneNumber || !OTP || !role) {
                throw new errors_1.ApiBadRequestError("Please provide the necessary details properly.");
            }
            let checkUserAuth = yield prisma.userAuthentication.findFirst({
                where: { phoneNumber },
            });
            if (!checkUserAuth) {
                throw new errors_1.ApiBadRequestError("No user found with provided phone number.");
            }
            if ((checkUserAuth === null || checkUserAuth === void 0 ? void 0 : checkUserAuth.phoneExpirationTime) &&
                new Date(checkUserAuth.phoneExpirationTime).getTime() <
                    new Date().getTime()) {
                throw new errors_1.ApiBadRequestError("OTP has expired");
            }
            if (checkUserAuth.phoneOtp === OTP) {
                checkUserAuth = yield prisma.userAuthentication.update({
                    where: { id: checkUserAuth.id },
                    data: { isPhoneVerified: true },
                });
                let checkUser = yield prisma.user.findFirst({
                    where: { email: checkUserAuth.email },
                });
                if (checkUser) {
                    checkUser = yield prisma.user.update({
                        where: { id: checkUser === null || checkUser === void 0 ? void 0 : checkUser.id },
                        data: {
                            role,
                            phoneNumber,
                            isPhoneVerified: true,
                        },
                    });
                }
                const payload = {
                    id: checkUser === null || checkUser === void 0 ? void 0 : checkUser.id,
                    email: checkUser === null || checkUser === void 0 ? void 0 : checkUser.email,
                    phoneNumber: checkUser === null || checkUser === void 0 ? void 0 : checkUser.phoneNumber,
                    role: checkUser === null || checkUser === void 0 ? void 0 : checkUser.role,
                    isEmailVerified: checkUser === null || checkUser === void 0 ? void 0 : checkUser.isEmailVerified,
                    isPhoneVerified: checkUser === null || checkUser === void 0 ? void 0 : checkUser.isPhoneVerified,
                };
                const token = server.jwt.sign(payload, {
                    expiresIn: JWT_EXPIRATION_TIME,
                });
                return {
                    accessToken: token,
                    message: "Phone number verified successfully.",
                    data: { userdata: checkUser, userauth: checkUserAuth },
                };
            }
            else {
                throw new errors_1.ApiBadRequestError("Invalid OTP provided.");
            }
        });
    }
    ///--------------------------------------------SET PASSWORD/EDIT PASSWORD-----------------------------------------
    setPassword(email, role, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email || !role || !newPassword) {
                throw new errors_1.ApiBadRequestError("Please provide the necessary details properly.");
            }
            try {
                // Check if the user exists and is either email verified or has the email verified flag set to true
                const user = yield prisma.user.findFirst({
                    where: {
                        email,
                        isEmailVerified: true,
                    },
                });
                if (!user) {
                    throw new errors_1.ApiBadRequestError("user not found or not verified");
                }
                // Hash the password
                const hashedPassword = yield bcrypt_1.default.hash(newPassword, SALT_ROUNDS);
                // Update the passwordin user table
                const updatedUser = yield prisma.user.update({
                    where: { id: user.id },
                    data: { hashedPassword },
                });
                return { message: "Updated Successfully", data: updatedUser };
            }
            catch (error) {
                return { message: error.message };
            }
        });
    }
    // /-------------------------------------------LOGIN USER---------------------------------------
    loginUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma.user.findUnique({ where: { email: email } });
            if (!user || !user.hashedPassword) {
                return {
                    user: null,
                    isMatch: false,
                    message: "Firstly create user or set password from settings",
                };
            }
            const isMatch = yield bcrypt_1.default.compare(password, user.hashedPassword);
            return {
                user,
                isMatch,
                message: isMatch
                    ? "Login successful"
                    : "Given email/password combination is invalid",
            };
        });
    }
    // /-------------------------------------------REWUEST EMAIL CHANGE---------------------------------------
    requestEmailChange(server, request, reply, newemail
    // id: number
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!newemail) {
                return reply.code(400).send({ message: "New email is required" });
            }
            const id = request.user.id;
            const token = jsonwebtoken_1.default.sign({ id, email: newemail }, JWT_TOKEN_SECRET, {
                expiresIn: "1h",
            });
            const confirmationLink = `https://your-ecommerce-site.com/confirm-email-change?token=${token}`;
            try {
                yield (0, mail_1.sendEmail)(newemail, "Confirm your email change", `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd;">
        <h1 style="color: #333;">Your E-commerce Site</h1>
        <p style="font-size: 16px;">Please confirm your email change by clicking on the following link:</p>
        <a href="${confirmationLink}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Confirm your email change</a>
        <p style="font-size: 16px; margin-top: 20px;">If you did not request this email change, please ignore this email.</p>
        <div style="margin-top: 30px; font-size: 14px;">
          <p>Thank you,</p>
            <p>AYRU JAIPUR</p>
            <p>+91-9785852222</p>
        </div>
      </div>
    `);
                reply.send({
                    accessToken: token,
                    message: "Confirmation email sent. Please check your inbox.",
                });
            }
            catch (error) {
                throw new errors_1.ApiInternalServerError("Failed to send confirmation email");
            }
        });
    }
    // /-------------------------------------------CONFIRM EMAIL CHANGE---------------------------------------
    confirmEmailChange(server, request, reply, id, newemail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield prisma.user.findUnique({
                    where: { id },
                });
                if (!user || !(user === null || user === void 0 ? void 0 : user.userAuthenticationId)) {
                    return reply.code(404).send({ message: "User not found" });
                }
                const userAuth = yield prisma.userAuthentication.findUnique({
                    where: { id: user === null || user === void 0 ? void 0 : user.userAuthenticationId },
                });
                yield prisma.user.update({
                    where: { id: id },
                    data: {
                        email: newemail,
                        // isEmailVerified: false
                    },
                });
                yield prisma.userAuthentication.update({
                    where: { id: user === null || user === void 0 ? void 0 : user.userAuthenticationId },
                    data: {
                        newEmail: userAuth === null || userAuth === void 0 ? void 0 : userAuth.email,
                        email: newemail,
                        // isEmailVerified: false,
                    },
                });
                reply.send({ message: "Email updated successfully" });
            }
            catch (error) {
                reply.code(400).send({ message: error.message });
            }
        });
    }
    // /-------------------------------------------GET ALL USERS---------------------------------------
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.user.findMany({
                orderBy: {
                    updatedAt: "desc",
                },
            });
        });
    }
    // /-------------------------------------------GET USER BY---------------------------------------
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.user.findUnique({ where: { id } });
        });
    }
}
exports.default = new UserAuthServices();
// export async function createUser(data) {
//   const {
//     username,
//     email,
//     password,
//     phoneNumber,
//     country,
//     state,
//     city,
//     gender,
//     age,
//     role,
//   } = data;
//   const hash = await bcrypt.hash(password, SALT_ROUNDS);
//   const user = await prisma.user.create({
//     data: {
//       username,
//       email,
//       password: hash,
//       phoneNumber,
//       country,
//       state,
//       city,
//       gender,
//       age,
//       role,
//     },
//   });
//   return user;
// }
