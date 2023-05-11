import express from "express";
import {
  userLogin,
  userOtpSend,
  userregister,
} from "../controllers/userControllers.js";
const router = express.Router();

// Routes
router.post("/user/register", userregister);
router.post("/user/sendotp", userOtpSend);
router.post("/user/login", userLogin);

export default router;
