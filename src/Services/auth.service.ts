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
    let existingUser = await prisma.userAuthentication.findFirst({
      where: { email },
    });

    if (!existingUser) {
      existingUser = await prisma.userAuthentication.create({
        data: {
          email,
          emailOtp: otp,
          emailExpirationTime: expirationTime,
          isEmailVerified: false,
        },
      });
    } else {
      existingUser = await prisma.userAuthentication.update({
        where: { id: existingUser.id },
        data: {
          emailOtp: otp,
          emailExpirationTime: expirationTime,
          isEmailVerified: false,
        },
      });
      let checkUser = await prisma.user.findFirst({
        where: { userAuthenticationId: existingUser?.id },
      });

      if (checkUser) {
        await prisma.user.update({
          where: { id: checkUser?.id },
          data: {
            isEmailVerified: false,
          },
        });
      }
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
      return { message: `OTP sent to your email ${email}`, data: existingUser };
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
    let checkUserAuth = await prisma.userAuthentication.findFirst({
      where: { email },
    });
    let checkUser = await prisma.user.findFirst({
      where: { email },
    });

    if (!checkUserAuth) {
      throw new ApiBadRequestError(
        "No user found with provided role, email, and phone number."
      );
    }

    if (
      checkUserAuth?.emailExpirationTime &&
      new Date(checkUserAuth.emailExpirationTime).getTime() <
        new Date().getTime()
    ) {
      throw new ApiBadRequestError("OTP has expired");
    }
    if (checkUserAuth.emailOtp == OTP) {
      checkUserAuth = await prisma.userAuthentication.update({
        where: { id: checkUserAuth.id },
        data: { isEmailVerified: true },
      });
      if (!checkUser) {
        checkUser = await prisma.user.create({
          data: {
            role,
            email,
            isEmailVerified: true,
            userAuthenticationId: checkUserAuth?.id,
          },
        });
      }
      if (checkUser) {
        checkUser = await prisma.user.update({
          where: { id: checkUser?.id },
          data: {
            isEmailVerified: true,
          },
        });
      }
      const payload = {
        id: checkUser?.id,
        email: checkUser?.email,
        phoneNumber: checkUser?.phoneNumber,
        role: checkUser?.role,
        isEmailVerified: checkUser?.isEmailVerified,
        isPhoneVerified: checkUser?.isPhoneVerified,
      };
      console.log("payload---", payload);

      const token = server.jwt.sign(payload);
      return [
        true,
        {
          accessToken: token,
          message: "OTP verified",
          data: { userdata: checkUser, userauth: checkUserAuth },
        },
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
    const existingUserByEmail = await prisma.userAuthentication.findFirst({
      where: { email },
    });

    if (!existingUserByEmail) {
      throw new ApiBadRequestError(
        "User not found with the provided email. Please verify email first."
      );
    }

    // Check if the provided phone number is already in use
    const existingUserByPhoneNumber = await prisma.userAuthentication.findFirst(
      {
        where: { phoneNumber },
      }
    );

    if (existingUserByPhoneNumber) {
      // Check if the user with the phone number is the same as the user with the provided email
      if (existingUserByPhoneNumber.id !== existingUserByEmail.id) {
        throw new ApiBadRequestError(
          "Phone number already in use with a different email."
        );
      }
      if (existingUserByPhoneNumber.isPhoneVerified) {
        const existingUser = await prisma.user.findFirst({
          where: { userAuthenticationId: existingUserByPhoneNumber?.id },
        });
        return {
          message: "Phone number already in use with the same email.",
          data: existingUser,
        };
      }
    }

    // If email is verified, update user with phone number and OTP
    if (existingUserByEmail.isEmailVerified && !existingUserByPhoneNumber) {
      await prisma.userAuthentication.update({
        where: { id: existingUserByEmail?.id },
        data: {
          phoneNumber,
          phoneOtp: otp,
          phoneExpirationTime: expirationTime,
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

    let checkUserAuth = await prisma.userAuthentication.findFirst({
      where: { phoneNumber },
    });

    if (!checkUserAuth) {
      throw new ApiBadRequestError("No user found with provided phone number.");
    }

    if (
      checkUserAuth?.phoneExpirationTime &&
      new Date(checkUserAuth.phoneExpirationTime).getTime() <
        new Date().getTime()
    ) {
      throw new ApiBadRequestError("OTP has expired");
    }

    if (checkUserAuth.phoneOtp === OTP) {
      checkUserAuth = await prisma.userAuthentication.update({
        where: { id: checkUserAuth.id },
        data: { isPhoneVerified: true },
      });

      let checkUser = await prisma.user.findFirst({
        where: { email: checkUserAuth.email },
      });
      if (checkUser && checkUser?.phoneNumber) {
        checkUser = await prisma.user.update({
          where: { id: checkUser?.id },
          data: {
            role,
            phoneNumber,
            isPhoneVerified: true,
          },
        });
      }

      const payload = {
        id: checkUser?.id,
        email: checkUser?.email,
        phoneNumber: checkUser?.phoneNumber,
        role: checkUser?.role,
        isEmailVerified: checkUser?.isEmailVerified,
        isPhoneVerified: checkUser?.isPhoneVerified,
      };

      const token = server.jwt.sign(payload, {
        expiresIn: JWT_EXPIRATION_TIME,
      });
      return {
        accessToken: token,
        message: "Phone number verified successfully.",
        data: checkUser,
      };
    } else {
      throw new ApiBadRequestError("Invalid OTP provided.");
    }
  }
  ///--------------------------------------------SET PASSWORD-----------------------------------------
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
          isEmailVerified: true,
        },
      });

      if (!user) {
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
  // async getAccessToken(server: FastifyInstance, user: any) {
  //   const token = server.jwt.sign(user, {
  //     secret: process.env.JWT_TOKEN_SECRET,
  //     expiresIn: process.env.JWT_EXPIRATION_TIME,
  //   });
  //   return token;
  // }
}

export default new UserAuthServices();

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
