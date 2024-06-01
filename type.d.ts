import "fastify";

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
}

// export interface User {
//   id?: number;
//   role?: string;
//   email?: string;
//   phoneNumber?: string;
//   isEmailVerified?: boolean;
//   isPhoneVerified?: boolean;
// }
