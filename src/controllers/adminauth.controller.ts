import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import AdminAuthServices from "../Services/adminAuth.service";
import { ApiUnauthorizedError } from "../errors";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

// /-------------------------------------------SIGNUP ADMIN---------------------------------------
export async function adminSignup(
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const {
    email,
    password,
    phoneNumber,
    //  adminCode,
    name,
    isActive,
  } = request.body as {
    email: string;
    password: string;
    // adminCode: string;
    phoneNumber: string;
    name: string;
    isActive: boolean;
  };

  try {
    const admin = await AdminAuthServices.signupAdmin(
      email,
      password,
      phoneNumber,
      // adminCode,
      name,
      isActive
    );
    reply.code(201).send({ message: "Admin signup successful", data: admin });
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}

// /-------------------------------------------EDIT ADMIN DETAILS---------------------------------------
export async function editAdminDetails(
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { email, password, phoneNumber, adminCode, name, isActive } =
    request.body as {
      email: string;
      password: string;
      adminCode: string;
      phoneNumber: string;
      name: string;
      isActive: boolean;
    };

  try {
    const admin = await AdminAuthServices.editAdminDetails(
      email,
      password,
      phoneNumber,
      adminCode,
      name,
      isActive
    );
    reply
      .code(201)
      .send({ message: "Admin details edited successful", data: admin });
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}

// /-------------------------------------------ADMIN LOGIN---------------------------------------
export async function adminLogin(
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { email, password } = request.body as {
    email: string;
    password: string;
  };

  try {
    const { admin, isMatch, message } = await AdminAuthServices.loginAdmin(
      email,
      password
    );

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
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}

// /-------------------------------------------CHANGE ADMIN PASSWORD---------------------------------------
export async function changeAdminPasswordHandler(
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { email, currentPassword, newPassword } = request.body as {
    email: string;
    currentPassword: string;
    newPassword: string;
  };

  try {
    const updatedAdmin = await AdminAuthServices.changeAdminPassword(
      email,
      currentPassword,
      newPassword
    );
    reply.send({
      message: "Password changed successfully",
      admin: updatedAdmin,
    });
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}
