import { FastifyInstance } from "fastify";
import {
  adminSignup,
  adminLogin,
  // getAccessToken,
} from "../controllers/adminauth.controller";
export default async function AuthRoutes(server: FastifyInstance) {
  // Admin signup
  server.post("/admin/signup", (request, reply) =>
    adminSignup(server, request, reply)
  );

  // Admin login
  server.post("/admin/login", (request, reply) =>
    adminLogin(server, request, reply)
  );

  // Change admin password
  // server.post<{
  //   Body: { email: string; currentPassword: string; newPassword: string };
  // }>(
  //   "/admin/change-password",
  //   { onRequest: [server.authenticateAdmin] },
  //   (request, reply) => changeAdminPasswordHandler(server, request, reply)
  // );
}
