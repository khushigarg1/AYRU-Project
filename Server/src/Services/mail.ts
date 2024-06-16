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

// Create transporter instance
// const transporter = nodemailer.createTransport(configOptions);

// Function to send email
export const sendEmail = async (to: string, subject: string, body: string) => {
  // if (process.env.NODE_ENV === "production" || true) {
  try {
    // Send email
    const info = await transporter.sendMail({
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
      from: process.env.GMAIL_ID!,
    });
    console.log(info);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
  // } else {
  //   console.log("Email not sent in development mode.");
  // }
};
