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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const dotenv_1 = require("dotenv");
const nodemailer_1 = __importDefault(require("nodemailer"));
(0, dotenv_1.config)();
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    secure: false,
    auth: {
        user: process.env.GMAIL_ID,
        pass: process.env.GMAIL_PASS,
    },
    debug: true,
});
// Create transporter instance
// const transporter = nodemailer.createTransport(configOptions);
// Function to send email
const sendEmail = (to, subject, body) => __awaiter(void 0, void 0, void 0, function* () {
    // if (process.env.NODE_ENV === "production" || true) {
    try {
        // Send email
        const info = yield transporter.sendMail({
            to,
            subject,
            html: `
          <html>
            <head>
              <meta charset="UTF-8">
              <title>FFG Email Verification</title>
              <link href="https://fonts.googleapis.com/css?family=NTR&display=swap" rel="stylesheet">
              <style>
                body {
                  background-color: #0F172A;
                  font-family: 'NTR', sans-serif;
                  color: white;
                  margin: 0;
                  padding: 0;
                }
                .container {
                  max-width: 600px;
                  margin: auto;
                  background-color: #1E293F;
                  padding: 30px;
                  border-radius: 10px;
                  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
                  color: white;
                }
                h1 {
                  text-align: center;
                  margin-top: 0;
                  margin-bottom: 20px;
                }
                p {
                  margin-top: 0;
                  margin-bottom: 20px;
                }
                .otp {
                  font-size: 24px;
                  text-align: center;
                  margin-top: 30px;
                  margin-bottom: 30px;
                  padding: 10px;
                  background-color: #2D3A5E;
                  border-radius: 5px;
                  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.25);
                  color: white;
                }
                .footer {
                  text-align: center;
                  font-size: 14px;
                }
                .contact-info {
                  text-align: center;
                  margin-top: 30px;
                }
                
                .contact-info p {
                  margin: 5px 0;
                }

              </style>
            </head>
            <body>
              ${body}
            </body>
          </html>
        `,
            from: process.env.GMAIL_ID,
        });
        return true;
    }
    catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
});
exports.sendEmail = sendEmail;
