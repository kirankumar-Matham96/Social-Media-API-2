// module imports
import { ApplicationError } from "../../../middlewares/errorHandling/customErrorHandling.middleware.js";
import OTPRepository from "../repositories/otp.repository.js";

/**
 * Controller class to handle all requests related to OTP.
 */
class OTPController {
  constructor() {
    this.otpRepo = new OTPRepository();
  }

  /**
   * To send OTP to the user.
   *  - If user provides an email, it will send the otp to that email.
   *  - If the user loggedin already and did not provide the email,
   *    it will find it by the user id and end the email.
   * @param {request} req
   * @param {response} res
   * @param {next middleware callback} next
   */
  sendOTP = async (req, res, next) => {
    try {
      const { userId } = req;
      const { email } = req.body;
      let response = {};
      if (email) {
        // if email is provided in the request
        response = await this.otpRepo.sendOtpToGivenEmail(email);
      } else {
        // if email is not provided in the request and user loggedin
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

  /**
   * To verify the OTP.
   * @param {request} req
   * @param {response} res
   * @param {next middleware callback} next
   */
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

   /**
   * To reset the password.
   * @param {request} req
   * @param {response} res
   * @param {next middleware callback} next
   */
  resetPassword = async (req, res, next) => {
    try {
      const { email, newPassword } = req.body;
      await this.otpRepo.resetPassword(email, newPassword);

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
