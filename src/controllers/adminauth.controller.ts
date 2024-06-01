import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
// import AdminAuthServices, { changeAdminPassword } from "../services/auth.service";
import AdminAuthServices from "../Services/adminauth.service";
// import {
//   CreateUser,
//   CreateAdmin,
//   LoginUser,
//   LoginAdmin,
// } from "../schema/auth.schema";
import { ApiUnauthorizedError } from "../errors";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

export async function adminSignup(
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { email, password } = request.body as {
    email: string;
    password: string;
    adminCode: string;
  };

  try {
    const user = await AdminAuthServices.signupAdmin(email, password);
    reply.code(201).send({ message: "Admin signup successful", data: user });
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}

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
    const { user, isMatch, message } = await AdminAuthServices.loginAdmin(
      email,
      password
    );

    if (!user || !isMatch || user.role !== "admin") {
      return reply.code(401).send({ message: "Unauthorized" });
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = server.jwt.sign(payload);
    reply.send({ token, data: user });
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}
// export async function changeAdminPasswordHandler(
//   server: FastifyInstance,
//   request: FastifyRequest,
//   reply: FastifyReply
// ) {
//   const { email, currentPassword, newPassword } = request.body as {
//     email: string;
//     currentPassword: string;
//     newPassword: string;
//   };

//   try {
//     const updatedAdmin = await changeAdminPassword(
//       email,
//       currentPassword,
//       newPassword
//     );
//     reply.send({
//       message: "Password changed successfully",
//       admin: updatedAdmin,
//     });
//   } catch (error) {
//     reply.code(400).send({ message: (error as Error).message });
//   }
// }
