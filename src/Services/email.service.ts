// services/emailService.js
import nodemailer, { TransportOptions } from "nodemailer";
import { config } from "dotenv";
import SMTPTransport from "nodemailer";

config();

const transporter = SMTPTransport.createTransport({
  service: "gmail",
  secure: false,
  auth: {
    user: process.env.GMAIL_ID,
    pass: process.env.GMAIL_PASS,
  },
  debug: true,
});

export async function sendResetEmail(email, resetToken) {
  const resetLink = `http://your-frontend-url/reset-password?token=${resetToken}`;
  const mailOptions = {
    from: "khushigarg.64901@gmail.com",
    to: email,
    subject: "Reset Your Password",
    html: `<p>Hello,</p><p>You have requested to reset your password. Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Reset email sent successfully");
  } catch (error) {
    console.error("Error sending reset email:", error);
    throw new Error("Failed to send reset email");
  }
}
