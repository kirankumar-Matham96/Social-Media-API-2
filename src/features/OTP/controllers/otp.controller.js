// module imports
import { ApplicationError } from "../../../middlewares/errorHandling/customErrorHandling.middleware.js";
import OTPRepository from "../repositories/otp.repository.js";

class OTPController {
  constructor() {
    this.otpRepo = new OTPRepository();
  }
  sendOTP = async (req, res, next) => {
    try {
      const { userId } = req;
      const { email } = req.body;
      let response = {};
      if (email) {
        response = await this.otpRepo.sendOtpToGivenEmail(email);
      } else {
        response = await this.otpRepo.sendOtpToLoggedinUserEmail(userId);
      }
      res.status(200).json({
        success: true,
        message: response.message,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  verifyOTP = async (req, res, next) => {
    try {
      const { otp, email } = req.body;

      this.otpRepo.verifyOtp(otp, email);

      res.status(200).json({
        success: true,
        message: "OTP verified",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  resetPassword = async (req, res, next) => {
    try {
      const { email, newPassword } = req.body;
      await this.otpRepo.resetPassword( email, newPassword);

      res.status(200).json({
        success: true,
        message: "Password updated!",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

export default OTPController;
