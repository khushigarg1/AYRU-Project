import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { sendEmail } from "./mail";
import {
  ApiBadRequestError,
  ApiInternalServerError,
  ApiUnauthorizedError,
} from "../errors";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

const prisma = new PrismaClient();

const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET || "your-secret";
const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME || "1h";

class UserServices {
  // Request Email Change
  async requestEmailChange(
    server: FastifyInstance,
    request: FastifyRequest,
    reply: FastifyReply,
    newemail: string,
    id: number
  ) {
    if (!newemail) {
      return reply.code(400).send({ message: "New email is required" });
    }

    // const id = request.user.id;
    console.log("id-------", id);

    const token = jwt.sign({ id, email: newemail }, JWT_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    const confirmationLink = `https://your-ecommerce-site.com/confirm-email-change?token=${token}`;

    try {
      await sendEmail(
        newemail,
        "Confirm your email change",
        `
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
    `
      );

      reply.send({
        accessToken: token,
        message: "Confirmation email sent. Please check your inbox.",
      });
    } catch (error) {
      throw new ApiInternalServerError("Failed to send confirmation email");
    }
  }

  // Edit Email
  async editEmail(
    server: FastifyInstance,
    request: FastifyRequest,
    reply: FastifyReply,
    id: number,
    newemail: string
  ) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });
      if (!user || !user?.userAuthenticationId) {
        return reply.code(404).send({ message: "User not found" });
      }
      const userAuth = await prisma.userAuthentication.findUnique({
        where: { id: user?.userAuthenticationId },
      });

      await prisma.user.update({
        where: { id: id },
        data: {
          email: newemail,
          // isEmailVerified: false
        },
      });
      await prisma.userAuthentication.update({
        where: { id: user?.userAuthenticationId },
        data: {
          newEmail: userAuth?.email,
          email: newemail,
          // isEmailVerified: false,
        },
      });

      reply.send({ message: "Email updated successfully" });
    } catch (error) {
      reply.code(400).send({ message: (error as Error).message });
    }
  }
}

export default new UserServices();
