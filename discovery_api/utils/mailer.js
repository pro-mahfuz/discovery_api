import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // or 'hotmail', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER,     // your email
    pass: process.env.EMAIL_PASS,     // your app password
  },
});

export const sendResetEmail = async (to, token) => {
  const resetUrl = `http://localhost:3000/reset-password/${token}`;

  await transporter.sendMail({
    from: `"Your App" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Password Reset Request",
    html: `
      <h3>Password Reset</h3>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
    `,
  });
};

export const sendWelcomeEmail = async (to, username) => {
  await transporter.sendMail({
    from: `"Your App" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Welcome to Our Service",
    html: `
      <h3>Welcome, ${username}!</h3>
      <p>Thank you for registering with us. We are excited to have you on board!</p>
      <p>If you have any questions, feel free to reach out.</p>
    `,
  });
};