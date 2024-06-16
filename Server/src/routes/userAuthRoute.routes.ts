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
  // getAccessToken,
} from "../Controllers/userAuth.controller";

export default async function AuthRoutes(server: FastifyInstance) {
  server.get("/", (request, reply) => getAllUsers(server, request, reply));

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
  //   getAccessToken(server, request, reply)
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
}
