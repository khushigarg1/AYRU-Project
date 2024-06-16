import "fastify";
import { FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    authenticateUser: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
    authenticateAdmin: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
  interface FastifyRequest {
    user: {
      id?: number;
      role?: string;
      email?: string;
      phoneNumber?: string;
      isEmailVerified?: boolean;
      isPhoneVerified?: boolean;
    };
  }
}

// export interface User {
//   id?: number;
//   role?: string;
//   email?: string;
//   phoneNumber?: string;
//   isEmailVerified?: boolean;
//   isPhoneVerified?: boolean;
// }
