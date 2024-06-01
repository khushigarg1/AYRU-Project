import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import userAuthServices from "../Services/auth.service";
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

// export async function getAccessToken(
//   server: FastifyInstance,
//   request: FastifyRequest,
//   reply: FastifyReply
// ) {
//   const user = request.body;
//   try {
//     const token = await userAuthServices.getAccessToken(user);
//     reply.send({ token });
//   } catch (error) {
//     reply.code(400).send({ message: (error as Error).message });
//   }
// }

// export async function userSignup(
//   server: FastifyInstance,
//   request: FastifyRequest,
//   reply: FastifyReply
// ) {
//   const {
//     username,
//     email,
//     hashedPassword,
//     phoneNumber,
//     country,
//     state,
//     city,
//     gender,
//     age,
//     role,
//     firstName,
//     lastName,
//   } = request.body as CreateUser["body"];

//   const hash = await bcrypt.hash(hashedPassword, SALT_ROUNDS);
//   const userdata = await prisma.user.create({
//     data: {
//       username,
//       email,
//       hashedPassword: hash,
//       phoneNumber,
//       country,
//       state,
//       city,
//       gender,
//       age,
//       role,
//       firstName,
//       lastName,
//     },
//   });

//   const payload = {
//     userId: userdata.id,
//     username: userdata.username,
//     phoneNumber: userdata.phoneNumber,
//     role: userdata.role,
//   };

//   const token = server.jwt.sign(payload);
//   reply.send({ token });
// }
