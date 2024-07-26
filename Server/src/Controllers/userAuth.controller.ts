import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import userAuthServices from "../Services/userAuth.service";
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

// /-------------------------------------------SEND OTP AT EMAIL---------------------------------------
export async function sendEmailOTP(
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { email, role } = request.body as { email: string; role: string };
  try {
    const response = await userAuthServices.sendEmailOTP(email, role);
    reply.send(response);
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}

// /-------------------------------------------VERIFY EMAIL OTP---------------------------------------
export async function verifyEmailOTP(
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { email, OTP, role } = request.body as {
    email: string;
    OTP: string;
    role: string;
  };

  try {
    const [success, user] = await userAuthServices.verifyEmailOTP(
      server,
      email,
      OTP,
      role
    );
    if (success) {
      reply.send(user);
    } else {
      reply.code(400).send({ message: "Invalid OTP" });
    }
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}

// /-------------------------------------------SEND OTP AT PHONE---------------------------------------
export async function sendPhoneOTP(
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { email, phoneNumber, role } = request.body as {
    email: string;
    phoneNumber: string;
    role: string;
  };
  try {
    const response = await userAuthServices.sendPhoneOTP(
      email,
      phoneNumber,
      role
    );
    reply.send(response);
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}

// /-------------------------------------------VERIFY PHONE OTP ---------------------------------------
export async function verifyPhoneOTP(
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { phoneNumber, OTP, role } = request.body as {
    phoneNumber: string;
    OTP: string;
    role: string;
  };
  try {
    const user = await userAuthServices.verifyPhoneOTP(
      server,
      phoneNumber,
      OTP,
      role
    );
    reply.send(user);
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}

// /-------------------------------------------SET PASSWORD /EDIT PASSWORD---------------------------------------
export async function setPassword(
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { email, role, newPassword } = request.body as {
    email: string;
    role: string;
    newPassword: string;
  };
  try {
    const user = await userAuthServices.setPassword(email, role, newPassword);
    reply.send(user);
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}

// /-------------------------------------------USER LOGIN---------------------------------------
export async function userLogin(
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { email, password } = request.body as {
    email: string;
    password: string;
  };

  const { user, isMatch, message } = await userAuthServices.loginUser(
    email,
    password
  );

  if (!user || !isMatch) {
    // return reply.code(401).send({ message });
    throw new ApiUnauthorizedError(message);
  }

  const payload = {
    id: user?.id,
    email: user?.email,
    phoneNumber: user?.phoneNumber,
    role: user?.role,
    isEmailVerified: user?.isEmailVerified,
    isPhoneVerified: user?.isPhoneVerified,
  };

  const token = server.jwt.sign(payload);
  reply.send({ accessToken: token, data: user });
}

// /-------------------------------------------REQUESTING FOR EMAIL CHANGE---------------------------------------
export async function requestEmailChange(
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
  // user: any
) {
  const { newemail } = request.body as { newemail: string };
  // const id = user?.id;
  try {
    const response = await userAuthServices.requestEmailChange(
      server,
      request,
      reply,
      newemail
      // id
    );
    reply.send(response);
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}

// /-------------------------------------------CONFIRM EMAIL CHANGE---------------------------------------
export async function confirmEmailChange(
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { token } = request.query as { token: string };
  if (!token) {
    return reply.code(400).send({ message: "Token is required" });
  }

  try {
    const secretKey = process.env.JWT_TOKEN_SECRET;
    const decoded = server.jwt.verify(token) as {
      id: number;
      email: string;
    };
    if (!decoded || !decoded.id || !decoded.email) {
      throw new Error("Invalid token or missing data");
    }

    await userAuthServices.confirmEmailChange(
      server,
      request,
      reply,
      decoded?.id,
      decoded.email
    );
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}

// /-------------------------------------------GET ALL USERS---------------------------------------
export async function getAllUsers(
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user = await userAuthServices.getAllUsers();
  reply.send({ data: user });
}

export async function getUser(
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as any;

  if (id != request?.user?.id) {
    throw new ApiUnauthorizedError("Access denied for the requested user.");
  }
  const user = await userAuthServices.getUserById(Number(id));

  if (!user) {
    reply.code(404).send({ message: "User not found" });
  } else {
    reply.send({ data: user });
  }
}
