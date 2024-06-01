import { FastifyInstance } from "fastify";
import {
  CreateUserBody,
  CreateAdminBody,
  LoginUserBody,
  LoginAdminBody,
} from "../schema/auth.schema";
import {
  requestEmailChange,
  confirmEmailChange,
} from "../controllers/user.controller";

export default async function UserRoutes(server: FastifyInstance) {
  server.post(
    "/request-email-change",
    { onRequest: [server.authenticateUser] },
    (request, reply) => {
      requestEmailChange(server, request, reply);
    }
  );
  server.get("/confirm-email-change", (request, reply) => {
    confirmEmailChange(server, request, reply);
  });
  // server.post("/edit-email", (request, reply) => {
  //   editEmail(server, request, reply);
  // });
}
