import crypto from "crypto";
import { hash } from "bcryptjs";
import { User } from "../../models/model.js";
import { setResetToken, getResetToken, deleteResetToken } from "../../utils/resetTokenStore.js";
import { sendResetEmail } from "../../utils/mailer.js";


// 1. Request Reset
export const requestReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");
    setResetToken(user.id, token);

    // TODO: Send token via email
    console.log(`Password reset link: http://localhost:3000/reset-password/${token}`);
    
    // In a real application, you would send this link via email to the user
    // For example, using nodemailer or any email service provider
    // sendEmail(user.email, `Reset your password`, `Click here to reset: http://localhost:3000/reset-password/${token}`);
    await sendResetEmail(email, token); // 💥 Send the real email

    res.json({ message: "Password reset email sent (see console for link)" });
  } catch (err) {
    next(err);
  }
};

// 2. Handle Reset
export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const userId = getResetToken(token);
    if (!userId) return res.status(400).json({ message: "Invalid or expired token" });

    const user = await User.findByPk(userId);
    user.password = await hash(newPassword, 10);
    await user.save();

    deleteResetToken(token);
    res.json({ message: "Password has been reset" });
  } catch (err) {
    next(err);
  }
};
