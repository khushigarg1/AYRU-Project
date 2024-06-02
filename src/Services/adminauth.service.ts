// authService.js

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { sendEmail } from "./mail";
import { generateRandomNumber } from "../utils/utils";
import {
  ApiBadRequestError,
  ApiInternalServerError,
  ApiUnauthorizedError,
} from "../errors";
import { logger } from "../logger";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;
const OTP_EXPIRATION = parseInt(process.env.OTP_EXPIRATION || "10");
const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET || "your-secret";
const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME || "1h";

class AdminAuthServices {
  // /-------------------------------------------SIGNUP ADMIN---------------------------------------
  async signupAdmin(
    email: string,
    password: string,
    phoneNumber: string,
    // adminCode: string,
    name: string,
    isActive: boolean
  ) {
    let admin = await prisma.admin.findUnique({ where: { email } });
    if (admin) {
      throw new ApiBadRequestError("Admin is already created. Please login");
    }
    // if (adminCode != process.env.ADMIN_CODE) {
    //   throw new ApiUnauthorizedError("Invalid admin code");
    // }

    const hashedPassword = await bcrypt.hash(password, 10);
    admin = await prisma.admin.create({
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
  }

  // /-------------------------------------------EDIT ADMIN DETAILS---------------------------------------
  async editAdminDetails(
    email: string,
    password: string,
    phoneNumber: string,
    adminCode: string,
    name: string,
    isActive: boolean
  ) {
    let admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      throw new ApiBadRequestError("Admin is not created. Please signup");
    }
    if (adminCode != process.env.ADMIN_CODE) {
      throw new ApiUnauthorizedError("Invalid admin code");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    admin = await prisma.admin.update({
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
  }

  // /-------------------------------------------LOGIN ADMIN---------------------------------------
  async loginAdmin(email: string, password: string) {
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      throw new ApiUnauthorizedError("Admin is not created. Please signup");
    }

    const isMatch = await bcrypt.compare(password, admin.hashedPassword);
    return {
      admin,
      isMatch,
      message: isMatch
        ? "Login successful"
        : "Given email/password combination is invalid",
    };
  }

  // /-------------------------------------------CHANGE ADMIN PASSWORD---------------------------------------
  async changeAdminPassword(
    email: string,
    currentPassword: string,
    newPassword: string
  ) {
    const admin = await prisma.admin.findUnique({ where: { email: email } });

    if (!admin) {
      throw new Error("Admin not found");
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.hashedPassword);
    if (!isMatch) {
      throw new Error("Invalid current password");
    }

    const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    const updatedAdmin = await prisma.admin.update({
      where: { email: email },
      data: { hashedPassword: hash },
    });

    return updatedAdmin;
  }

  // /-------------------------------------------GET ALL ADMIN---------------------------------------
  async getAdmins() {
    return await prisma.admin.findMany();
  }

  // /-------------------------------------------GET ADMIN BY ID---------------------------------------
  async getAdminById(id: number) {
    return await prisma.admin.findUnique({ where: { id } });
  }
  // async getAccessToken(server: FastifyInstance, user: any) {
  //   const token = server.jwt.sign(user, {
  //     secret: process.env.JWT_TOKEN_SECRET,
  //     expiresIn: process.env.JWT_EXPIRATION_TIME,
  //   });
  //   return token;
  // }
}

export default new AdminAuthServices();
