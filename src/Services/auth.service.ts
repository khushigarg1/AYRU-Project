// authService.js

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
import { sendEmail } from "./mail";
import { generateRandomNumber } from "../utils/utils";
import {
  ApiBadRequestError,
  ApiInternalServerError,
  ApiUnauthorizedError,
} from "../errors";
import { logger } from "../logger";
import { FastifyInstance } from "fastify";

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;
const OTP_EXPIRATION = parseInt(process.env.OTP_EXPIRATION || "10");
const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET || "your-secret";
const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME || "1h";

class UserAuthServices {
  ///-------------------------------------------SEND EMAIL OTP-----------------------------------------
  async sendEmailOTP(email: string, role: string) {
    if (!email || !role) {
      throw new ApiBadRequestError(
        "Please provide the necessary details properly."
      );
    }
    let otp = generateRandomNumber(1000, 9999).toString();
    let expirationTime = new Date(Date.now() + 60000 * OTP_EXPIRATION);
    let existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (!existingUser) {
      existingUser = await prisma.user.create({
        data: {
          email,
          emailOtp: otp,
          emailExpirationTime: expirationTime,
          role,
          isEmailVerified: false,
        },
      });
    } else {
      existingUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          emailOtp: otp,
          emailExpirationTime: expirationTime,
          role,
          isEmailVerified: false,
        },
      });
    }

    // if (process.env.NODE_ENV === "production" || true) {
    // const emailResult = await sendEmail(
    //   email,
    //   "AYRU JAIPUR | OTP for Login Secure Access",
    //   `
    //     <div class="container">
    //       <h1>AYRU JAIPUR</h1>
    //       <p>To complete your login, please use the following One-Time Password (OTP):</p>
    //       <div class="otp">${otp}</div>
    //       <p>This OTP is valid for 5 minutes. For your security, do not share this OTP with anyone.</p>
    //       <p>If you did not request this OTP, please contact our support team immediately.</p>
    //       <div class="contact-info">
    //         <p>Thank you,</p>
    //         <p>AYRU JAIPUR</p>
    //         <p>+91-9785852222</p>
    //       </div>
    //     </div>
    //   `
    // );

    // }
    const emailResult = true;
    if (emailResult) {
      return { message: `OTP sent to your email ${email}` };
    } else {
      throw new ApiInternalServerError("Failed to send email OTP");
    }
  }
  ///-------------------------------------------VERIFY EMAIL OTP-----------------------------------------
  async verifyEmailOTP(
    server: FastifyInstance,
    email: string,
    OTP: string,
    role: string
  ) {
    console.log(email, OTP, role);

    if (!email || !OTP || !role) {
      throw new ApiBadRequestError(
        "Please provide the necessary details properly."
      );
    }
    const checkUser = await prisma.user.findFirst({
      where: { email },
    });

    if (!checkUser) {
      throw new ApiBadRequestError(
        "No user found with provided role, email, and phone number."
      );
    }

    if (
      checkUser?.emailExpirationTime &&
      new Date(checkUser.emailExpirationTime).getTime() < new Date().getTime()
    ) {
      throw new ApiBadRequestError("OTP has expired");
    }
    if (checkUser.emailOtp == OTP) {
      await prisma.user.update({
        where: { id: checkUser.id },
        data: { isEmailVerified: true },
      });
      const payload = {
        id: checkUser?.id,
        email: checkUser?.email,
        username: checkUser?.username,
        phoneNumber: checkUser?.phoneNumber,
        role: checkUser?.role,
        isEmailVerified: checkUser?.isEmailVerified,
        isPhoneVerified: checkUser?.isPhoneVerified,
      };

      const token = server.jwt.sign(payload);
      // const payload1 = server.jwt.verify(token, {
      //   secret: process.env.JWT_SECRET,
      // });
      // const payload2 = server.jwt.verify(
      //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcmFtZSI6bnVsbCwicGhvbmVOdW1iZXIiOiI5MTY2NTY0OTA4Iiwicm9sZSI6InVzZXIiLCJpc0VtYWlsVmVyaWZpZWQiOnRydWUsImlzUGhvbmVWZXJpZmllZCI6dHJ1ZSwiaWF0IjoxNzE3MDg5Mjg5fQ.N3xv-6r6vOXuLCECNjTjLTeUiZbUVIke3WnE8qjl30I",
      //   {
      //     secret: "heyyy",
      //   }
      // );
      // console.log(payload1, payload2);

      return [
        true,
        { accessToken: token, message: "OTP verified", data: checkUser },
      ];
    } else {
      return [false];
    }
  }
  ///-------------------------------------------SEND PHONE OTP-----------------------------------------
  async sendPhoneOTP(email: string, phoneNumber: string, role: string) {
    if (!email || !phoneNumber || !role) {
      throw new ApiBadRequestError(
        "Please provide the necessary details properly."
      );
    }

    let otp = generateRandomNumber(1000, 9999).toString();
    let expirationTime = new Date(Date.now() + 60000 * OTP_EXPIRATION);
    // if user with email exists or not
    const existingUserByEmail = await prisma.user.findFirst({
      where: { email },
    });

    if (!existingUserByEmail) {
      throw new ApiBadRequestError(
        "User not found with the provided email. Please verify email first."
      );
    }

    // Check if the provided phone number is already in use
    const existingUserByPhoneNumber = await prisma.user.findFirst({
      where: { phoneNumber },
    });

    if (existingUserByPhoneNumber) {
      // Check if the user with the phone number is the same as the user with the provided email
      if (existingUserByPhoneNumber.id !== existingUserByEmail.id) {
        throw new ApiBadRequestError(
          "Phone number already in use with a different email."
        );
      }
      if (existingUserByPhoneNumber.isPhoneVerified) {
        const existingUser = await prisma.user.findFirst({
          where: { email, phoneNumber },
        });
        return {
          message: "Phone number already in use with the same email.",
          data: {
            existingUser,
          },
        };
      }
    }

    // If email is verified, update user with phone number and OTP
    if (existingUserByEmail.isEmailVerified && !existingUserByPhoneNumber) {
      await prisma.user.update({
        where: { id: existingUserByEmail?.id },
        data: {
          phoneNumber,
          phoneOtp: otp,
          phoneExpirationTime: expirationTime,
          role,
          isPhoneVerified: false,
        },
      });

      logger.info(`SMS OTP is : ${otp}`);

      return { message: `OTP sent to your phone number ${phoneNumber}` };
    } else {
      throw new ApiBadRequestError(
        "Please verify your email first before adding a phone number."
      );
    }
  }

  ///-------------------------------------------VERIFY PHONE OTP-----------------------------------------
  async verifyPhoneOTP(
    server: FastifyInstance,
    phoneNumber: string,
    OTP: string,
    role: string
  ) {
    if (!phoneNumber || !OTP || !role) {
      throw new ApiBadRequestError(
        "Please provide the necessary details properly."
      );
    }
    const checkUser = await prisma.user.findFirst({
      where: { phoneNumber, role },
    });

    if (!checkUser) {
      throw new ApiBadRequestError(
        "No user found with provided role and phone number."
      );
    }

    if (
      checkUser?.phoneExpirationTime &&
      new Date(checkUser.phoneExpirationTime).getTime() < new Date().getTime()
    ) {
      throw new ApiBadRequestError("OTP has expired");
    }
    console.log(checkUser);

    if (checkUser.phoneOtp === OTP) {
      await prisma.user.update({
        where: { id: checkUser.id },
        data: { isPhoneVerified: true },
      });

      const payload = {
        id: checkUser?.id,
        userame: checkUser?.username,
        email: checkUser?.email,
        phoneNumber: checkUser?.phoneNumber,
        role: checkUser?.role,
        isEmailVerified: checkUser?.isEmailVerified,
        isPhoneVerified: checkUser?.isPhoneVerified,
      };

      const token = server.jwt.sign(payload);
      return {
        accessToken: token,
        message: "Phone number verified successfully.",
        data: checkUser,
      };
    } else {
      throw new ApiBadRequestError("Invalid OTP provided.");
    }
  }

  async setPassword(email: string, role: string, newPassword: string) {
    if (!email || !role || !newPassword) {
      throw new ApiBadRequestError(
        "Please provide the necessary details properly."
      );
    }
    try {
      // Check if the user exists and is either email verified or has the email verified flag set to true
      const user = await prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (!user || !user?.isEmailVerified) {
        throw new ApiBadRequestError("user not found or not verified");
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

      // Update the passwordin user table
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { hashedPassword },
      });

      return { message: "Updated Successfully", data: updatedUser };
    } catch (error) {
      return { message: (error as Error).message };
    }
  }

  async getAccessToken(server: FastifyInstance, user: any) {
    const token = server.jwt.sign(user, {
      secret: process.env.JWT_TOKEN_SECRET,
      expiresIn: process.env.JWT_EXPIRATION_TIME,
    });
    return token;
  }
}

export default new UserAuthServices();

export async function changeAdminPassword(email, currentPassword, newPassword) {
  const admin = await prisma.admin.findUnique({ where: { email: email } });

  if (!admin) {
    throw new Error("Admin not found");
  }

  const isMatch = await bcrypt.compare(currentPassword, admin.password);
  if (!isMatch) {
    throw new Error("Invalid current password");
  }

  const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);

  const updatedAdmin = await prisma.admin.update({
    where: { email: email },
    data: { password: hash },
  });

  return updatedAdmin;
}

export async function createUser(data) {
  const {
    username,
    email,
    password,
    phoneNumber,
    country,
    state,
    city,
    gender,
    age,
    role,
  } = data;
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hash,
      phoneNumber,
      country,
      state,
      city,
      gender,
      age,
      role,
    },
  });
  return user;
}

export async function loginUser(email, password) {
  const user = await prisma.user.findUnique({ where: { email: email } });
  const isMatch = user && (await bcrypt.compare(password, user.password));
  return { user, isMatch };
}

export async function createAdmin(email, password, name, phoneNumber) {
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  const admin = await prisma.admin.create({
    data: {
      email,
      password: hash,
      name,
      phoneNumber,
    },
  });
  return admin;
}

export async function loginAdmin(email, password) {
  const admin = await prisma.admin.findUnique({ where: { email: email } });
  const isMatch = admin && (await bcrypt.compare(password, admin.password));
  return { admin, isMatch };
}
