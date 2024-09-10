"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const userAuth_controller_1 = require("../Controllers/userAuth.controller");
const fs = require("fs").promises;
const path = require("path");
function AuthRoutes(server) {
    return __awaiter(this, void 0, void 0, function* () {
        server.get("/", { onRequest: [server === null || server === void 0 ? void 0 : server.authenticateAdmin] }, (request, reply) => (0, userAuth_controller_1.getAllUsers)(server, request, reply));
        server.get("/:id", { onRequest: [server === null || server === void 0 ? void 0 : server.authenticateUser] }, (request, reply) => (0, userAuth_controller_1.getUser)(server, request, reply));
        server.post("/send-email-otp", (request, reply) => (0, userAuth_controller_1.sendEmailOTP)(server, request, reply));
        server.post("/verify-email-otp", (request, reply) => (0, userAuth_controller_1.verifyEmailOTP)(server, request, reply));
        server.post("/send-phone-otp", (request, reply) => (0, userAuth_controller_1.sendPhoneOTP)(server, request, reply));
        server.post("/verify-phone-otp", (request, reply) => (0, userAuth_controller_1.verifyPhoneOTP)(server, request, reply));
        server.post("/set-password", (request, reply) => {
            (0, userAuth_controller_1.setPassword)(server, request, reply);
        });
        // server.post("/get-access-token", (request, reply) =>
        //   getaccessToken(server, request, reply)
        // );
        // User signup
        // server.post<{ Body: CreateUserBody }>("/user/signup", (request, reply) =>
        //   userSignup(server, request, reply)
        // );
        // User login
        server.post("/user/login", (request, reply) => (0, userAuth_controller_1.userLogin)(server, request, reply));
        server.post("/request-email-change", { onRequest: [server.authenticateUser] }, 
        // { preHandler: server.authenticateUser },
        (request, reply) => {
            // console.log(request?.user, request);
            (0, userAuth_controller_1.requestEmailChange)(server, request, reply);
        });
        server.get("/confirm-email-change", (request, reply) => {
            (0, userAuth_controller_1.confirmEmailChange)(server, request, reply);
        });
        server.get("/country-codes", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const filePath = path.join(__dirname, "../phonecodes.json");
                const fileData = yield fs.readFile(filePath, "utf8");
                const jsonData = JSON.parse(fileData);
                return reply.send(jsonData);
            }
            catch (error) {
                console.error("Error reading the file:", error);
                return reply.code(500).send({ error: "Error reading country codes" });
            }
        }));
    });
}
exports.default = AuthRoutes;
