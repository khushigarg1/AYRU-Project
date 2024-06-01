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
  async loginUser(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user || !user.hashedPassword) {
      return {
        user: null,
        isMatch: false,
        message: "Firstly create user or set password from settings",
      };
    }

    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    return {
      user,
      isMatch,
      message: isMatch
        ? "Login successful"
        : "Given email/password combination is invalid",
    };
  }

  async signupAdmin(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
        role: "admin", // Assign the admin role
      },
    });
    return user;
  }

  async loginAdmin(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.hashedPassword) {
      return {
        user: null,
        isMatch: false,
        message: "Firstly create user or set password from settings",
      };
    }

    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    return {
      user,
      isMatch,
      message: isMatch ? "Login successful" : "Invalid password",
    };
  }

  //  async  changeAdminPassword(email, currentPassword, newPassword) {
  //   const admin = await prisma.admin.findUnique({ where: { email: email } });

  //   if (!admin) {
  //     throw new Error("Admin not found");
  //   }

  //   const isMatch = await bcrypt.compare(currentPassword, admin.password);
  //   if (!isMatch) {
  //     throw new Error("Invalid current password");
  //   }

  //   const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);

  //   const updatedAdmin = await prisma.admin.update({
  //     where: { email: email },
  //     data: { password: hash },
  //   });

  //   return updatedAdmin;
  // }

  // async getAccessToken(server: FastifyInstance, user: any) {
  //   const token = server.jwt.sign(user, {
  //     secret: process.env.JWT_TOKEN_SECRET,
  //     expiresIn: process.env.JWT_EXPIRATION_TIME,
  //   });
  //   return token;
  // }
}

export default new AdminAuthServices();
