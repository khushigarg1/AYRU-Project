import { FastifyInstance } from "fastify";
import {
  adminSignup,
  adminLogin,
  editAdminDetails,
  changeAdminPasswordHandler,
  getAllAdmins,
  getAdmin,
  // getAccessToken,
} from "../Controllers/adminAuth.controller";

export default async function AdminAuthRoutes(server: FastifyInstance) {
  server.post(
    "/signup",
    { onRequest: [server.authenticateAdmin] },
    (request, reply) => adminSignup(server, request, reply)
  );

  server.put(
    "/editdetail",
    { onRequest: [server.authenticateAdmin] },
    (request, reply) => {
      editAdminDetails(server, request, reply);
    }
  );

  server.post("/login", (request, reply) => adminLogin(server, request, reply));

  server.put(
    "/change-password",
    { onRequest: [server.authenticateAdmin] },
    (request, reply) => changeAdminPasswordHandler(server, request, reply)
  );

  server.get("/", { onRequest: [server.authenticateAdmin] }, (request, reply) =>
    getAllAdmins(server, request, reply)
  );

  server.get(
    "/:id",
    { onRequest: [server.authenticateAdmin] },
    (request, reply) => getAdmin(server, request, reply)
  );
}
