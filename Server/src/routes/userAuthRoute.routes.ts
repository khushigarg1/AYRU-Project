import { FastifyInstance } from "fastify";
import {
  CreateUserBody,
  CreateAdminBody,
  LoginUserBody,
  LoginAdminBody,
} from "../schema/auth.schema";
import {
  // userSignup,
  userLogin,
  sendEmailOTP,
  sendPhoneOTP,
  verifyPhoneOTP,
  verifyEmailOTP,
  setPassword,
  requestEmailChange,
  confirmEmailChange,
  getAllUsers,
  getUser,
  // getaccessToken,
} from "../Controllers/userAuth.controller";

const fs = require("fs").promises;
const path = require("path");

export default async function AuthRoutes(server: FastifyInstance) {
  server.get(
    "/",
    { onRequest: [server?.authenticateAdmin] },
    (request, reply) => getAllUsers(server, request, reply)
  );

  server.get(
    "/:id",
    { onRequest: [server?.authenticateUser] },
    (request, reply) => getUser(server, request, reply)
  );
  server.post("/send-email-otp", (request, reply) =>
    sendEmailOTP(server, request, reply)
  );
  server.post("/verify-email-otp", (request, reply) =>
    verifyEmailOTP(server, request, reply)
  );
  server.post("/send-phone-otp", (request, reply) =>
    sendPhoneOTP(server, request, reply)
  );
  server.post("/verify-phone-otp", (request, reply) =>
    verifyPhoneOTP(server, request, reply)
  );

  server.post("/set-password", (request, reply) => {
    setPassword(server, request, reply);
  });

  // server.post("/get-access-token", (request, reply) =>
  //   getaccessToken(server, request, reply)
  // );

  // User signup
  // server.post<{ Body: CreateUserBody }>("/user/signup", (request, reply) =>
  //   userSignup(server, request, reply)
  // );

  // User login
  server.post<{ Body: LoginUserBody }>("/user/login", (request, reply) =>
    userLogin(server, request, reply)
  );
  server.post(
    "/request-email-change",
    { onRequest: [server.authenticateUser] },
    // { preHandler: server.authenticateUser },
    (request, reply) => {
      // console.log(request?.user, request);

      requestEmailChange(server, request, reply);
    }
  );
  server.get("/confirm-email-change", (request, reply) => {
    confirmEmailChange(server, request, reply);
  });
  server.get("/country-codes", async (request, reply) => {
    try {
      const filePath = path.join(__dirname, "../phonecodes.json");
      const fileData = await fs.readFile(filePath, "utf8");
      const jsonData = JSON.parse(fileData);

      return reply.send(jsonData);
    } catch (error) {
      console.error("Error reading the file:", error);
      return reply.code(500).send({ error: "Error reading country codes" });
    }
  });
}
