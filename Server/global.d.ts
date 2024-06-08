// global.d.ts
import "fastify";
import { User } from "./type";

declare module "fastify" {
  interface FastifyRequest {
    user: User;
  }
}
