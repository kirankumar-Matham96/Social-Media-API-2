// package imports
import express from "express";

// module imports
import OTPController from "../controllers/otp.controller.js";

const router = express.Router();
const otpController = new OTPController();

router.post("/send", (req, res, next) => otpController.sendOTP(req, res, next));
router.post("/verify", (req, res, next) =>
  otpController.verifyOTP(req, res, next)
);
router.put("/reset-password", (req, res, next) =>
  otpController.resetPassword(req, res, next)
);

export default router;
