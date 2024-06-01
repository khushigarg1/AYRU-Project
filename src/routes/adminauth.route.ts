import { FastifyInstance } from "fastify";
import {
  adminSignup,
  adminLogin,
  editAdminDetails,
  changeAdminPasswordHandler,
  // getAccessToken,
} from "../Controllers/adminAuth.controller";

export default async function AdminAuthRoutes(server: FastifyInstance) {
  server.post("/signup", (request, reply) =>
    adminSignup(server, request, reply)
  );

  server.put(
    "/editdetail",
    { onRequest: [server.authenticateAdmin] },
    (request, reply) => {
      editAdminDetails(server, request, reply);
    }
  );

  server.post("/login", (request, reply) => adminLogin(server, request, reply));

  server.put<{
    Body: { email: string; currentPassword: string; newPassword: string };
  }>(
    "/change-password",
    { onRequest: [server.authenticateAdmin] },
    (request, reply) => changeAdminPasswordHandler(server, request, reply)
  );
}
