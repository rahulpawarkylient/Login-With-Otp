import users from "../models/userSchema.js";
import nodemailer from "nodemailer";
import userotp from "../models/userOtp.js";
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';

dotenv.config();

// email config
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false,
  },
});

export const userregister = async (req, res) => {
  const { fname, email, password } = req.body;

  if (!fname || !email || !password) {
    return res.status(400).json({ error: "Please enter all input data" });
  }

  try {
    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .send({ message: "This user already exists in our database" });
    }

    const user = new users({
      fname,
      email,
      password,
    });

    // Hash password here using your chosen library, e.g. bcrypt

    const savedUser = await user.save();
    return res.status(200).json(savedUser);
  } catch (error) {
    return res.status(400).json({ error: "Invalid details", error });
  }
};

// user send otp
export const userOtpSend = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Please enter your email" });
  }

  try {
    const existingUser = await users.findOne({ email });

    if (!existingUser) {
      return res
        .status(400)
        .json({ error: "This user does not exist in our database" });
    }

    const OTP = Math.floor(100000 + Math.random() * 900000);

    let otpData = await userotp.findOne({ email });
    if (!otpData) {
      otpData = await userotp.create({ email, otp: OTP });
    } else {
      otpData.otp = OTP;
      await otpData.save();
    }

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Sending Email For OTP Validation",
      text: `OTP: ${OTP}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(400).json({ error: "Could not send email" });
      }
      console.log("Email sent successfully:", info.response);
      return res.status(200).json({ message: "Email sent successfully" });
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(400).json({ error: "Invalid details", error });
  }
};




export const userLogin = async (req, res) => {
  const { email, otp } = req.body;

  if (!otp || !email) {
    return res.status(400).json({ error: "Please enter your OTP and email" });
  }

  try {
    const otpVerification = await userotp.findOne({ email: email });

    if (otpVerification && otpVerification.otp === otp) {
      const user = await users.findOne({ email: email });

      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }

      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

      if (!user.tokens) {
        user.tokens = [];
      }

      user.tokens.push({ token: token });
      await user.save();

      return res.json({ token: token });
    } else {
      return res.status(400).json({ error: "Invalid OTP" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Invalid details" });
  }
};


