import nodemailer from "nodemailer";
import env from "../config/environment.js";

/* =========================================
   EMAIL TRANSPORTER
========================================= */

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: env.email.user,
    pass: env.email.password,
  },
});

/* =========================================
   VERIFY EMAIL CONFIGURATION
========================================= */

export const verifyEmailService = async () => {
  try {
    await transporter.verify();

    console.log("✅ Email service is ready");
  } catch (error) {
    console.error(
      "❌ Email service verification failed:",
      error.message
    );
  }
};

/* =========================================
   SEND EMAIL
========================================= */

export const sendEmail = async ({
  to,
  subject,
  html,
  text,
}) => {
  try {
    if (!to) {
      throw new Error("Recipient email is required");
    }

    const mailOptions = {
      from: `"NEXORA" <${env.email.user}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(
      `📧 Email sent successfully: ${info.messageId}`
    );

    return info;
  } catch (error) {
    console.error(
      "❌ Email sending failed:",
      error.message
    );

    throw new Error("Failed to send email");
  }
};

/* =========================================
   WELCOME EMAIL
========================================= */

export const sendWelcomeEmail = async (
  userEmail,
  userName
) => {
  return sendEmail({
    to: userEmail,

    subject: "Welcome to NEXORA 🚀",

    text: `Welcome to NEXORA, ${userName}!`,

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 30px;
        background: #111111;
        color: #ffffff;
        border-radius: 12px;
      ">
        <h1 style="color: #38bdf8;">
          Welcome to NEXORA 🚀
        </h1>

        <p>
          Hello ${userName},
        </p>

        <p>
          Your NEXORA account has been created successfully.
        </p>

        <p>
          Discover premium laptops designed for
          work, creativity, gaming and everything in between.
        </p>

        <p>
          Thank you for joining NEXORA.
        </p>
      </div>
    `,
  });
};

/* =========================================
   ORDER CONFIRMATION EMAIL
========================================= */

export const sendOrderConfirmationEmail = async ({
  userEmail,
  userName,
  orderId,
  totalAmount,
}) => {
  return sendEmail({
    to: userEmail,

    subject: `NEXORA Order Confirmed - ${orderId}`,

    text: `Hi ${userName}, your NEXORA order ${orderId} has been confirmed.`,

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 30px;
        background: #111111;
        color: #ffffff;
        border-radius: 12px;
      ">
        <h1 style="color: #38bdf8;">
          Order Confirmed ✓
        </h1>

        <p>
          Hello ${userName},
        </p>

        <p>
          Your NEXORA order has been successfully confirmed.
        </p>

        <p>
          <strong>Order ID:</strong> ${orderId}
        </p>

        <p>
          <strong>Total:</strong> $${totalAmount}
        </p>

        <p>
          We will notify you when your order is shipped.
        </p>

        <p>
          Thank you for shopping with NEXORA.
        </p>
      </div>
    `,
  });
};

/* =========================================
   ORDER STATUS EMAIL
========================================= */

export const sendOrderStatusEmail = async ({
  userEmail,
  userName,
  orderId,
  status,
}) => {
  return sendEmail({
    to: userEmail,

    subject: `NEXORA Order Update - ${orderId}`,

    text: `Your order ${orderId} status has been updated to ${status}.`,

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 30px;
        background: #111111;
        color: #ffffff;
        border-radius: 12px;
      ">
        <h1 style="color: #38bdf8;">
          Order Update
        </h1>

        <p>
          Hello ${userName},
        </p>

        <p>
          Your NEXORA order status has been updated.
        </p>

        <p>
          <strong>Order ID:</strong> ${orderId}
        </p>

        <p>
          <strong>Current Status:</strong> ${status}
        </p>

        <p>
          Thank you for choosing NEXORA.
        </p>
      </div>
    `,
  });
};