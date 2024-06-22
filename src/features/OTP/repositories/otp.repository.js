// package imports
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
import bcrypt from "bcrypt";

// module imports
import { userSchema } from "../../user/schemas/user.schema.js";
import { ApplicationError } from "../../../middlewares/errorHandling/customErrorHandling.middleware.js";

// user model initialization
const UserModel = new mongoose.model("Users", userSchema);

/**
 * Repository class to handle all OTP related database operations.
 * It also handles tasks like: generating and sending OTP, sending OTP through emails.
 */
class OTPRepository {
  constructor() {
    this.isValidOTP = false;
  }

  /**
   * To generate a 6 digit alpha numeric OTP.
   * OTP may contain numbers, alphabets(upper and lower case).
   * To effectively verify the OTP, the generated OTP is saved to the class instance.
   * @returns string
   */
  generateOTP = () => {
    this.otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: true,
      upperCaseAlphabets: true,
    });
    return this.otp;
  };

  /**
   * To send an OTP if the user provided an email while requesting.
   * To effectively verify the OTP, the email of the requester is saved to the class instance.
   * @param {Email of the user who requested for OTP} userEmail
   * @returns Object
   */
  sendOtpToGivenEmail = async (userEmail) => {
    try {
      // storing the email for later verification
      this.email = userEmail;

      // configure nodemailer
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          /*
            The process to OAuth for the google account is changed.
            The procedure showed in the lecture is not working as
            there are no options told in the lecture.
            Hence using the credentials provided in one of
            the assignment problems.
            */
          user: "codingninjas2k16@gmail.com",
          pass: "slwvvlczduktvhdj",
        },
      });

      // create an OTP
      const OTP = this.generateOTP();

      // send an email
      await transporter.sendMail({
        from: "codingninjas2k16@gmail.com",
        to: userEmail,
        subject: "OTP to reset password - Post Away App",
        text: `This is the OTP to reset your account password\n\n 
          OTP: ${OTP}\n\nDo not share OTP to anyone.\n\nPost Away App
          `,
      });

      return { message: "OTP sent to your email account" };
    } catch (error) {
      console.log(error);
      if (error instanceof ApplicationError) {
        throw error;
      }

      throw new ApplicationError(
        "something went wrong while resetting the password",
        500
      );
    }
  };

  /**
   * To send an OTP if the user is already loggedin and did not provide an email while requesting.
   * To effectively verify the OTP, the email of the requester is saved to the class instance.
   * @param {id of the loggedin user} userId
   * @returns Object
   */
  sendOtpToLoggedinUserEmail = async (userId) => {
    try {
      // get the user email
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new ApplicationError("user not found", 404);
      }

      // get user email
      const email = user.email;
      this.email = email;

      // configure nodemailer
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          /*
            The process to OAuth for the google account is changed.
            The procedure showed in the lecture is not working as
            there are no options told in the lecture.
            Hence using the credentials provided in one of
            the assignment problems.
           */
          user: "codingninjas2k16@gmail.com",
          pass: "slwvvlczduktvhdj",
        },
      });

      // create an OTP
      const OTP = this.generateOTP();

      // send an email
      await transporter.sendMail({
        from: "codingninjas2k16@gmail.com",
        to: email,
        subject: "OTP to reset password - Post Away App",
        text: `This is the OTP to reset your account password\n\n 
            OTP: ${OTP}\n\nDo not share OTP to anyone.\n\nPost Away App
        `,
      });

      return { message: "OTP sent to your email account" };
    } catch (error) {
      console.log(error);
      if (error instanceof ApplicationError) {
        throw error;
      }

      throw new ApplicationError(
        "something went wrong while resetting the password",
        500
      );
    }
  };

  /**
   * To verify the OTP.
   *  - To effectively verify the OTP,
   *    the email of the requester and the generated OTP are saved to the class instance.
   *  - Once the verification is done, user can reset the password only once.
   * @param {*} otp
   * @param {*} email
   */
  verifyOtp = (otp, email) => {
    try {
      // verifying if the email of the requester and the otp matches
      if (email !== this.email || otp !== this.otp) {
        throw new ApplicationError("OTP did not match, please try again!", 400);
      }
      // after verification, setting the param for resetting the password
      this.isValidOTP = true;
    } catch (error) {
      console.log(error);
      if (error instanceof ApplicationError) {
        throw error;
      }

      throw new ApplicationError(
        "something went wrong while verifying the OTP",
        500
      );
    }
  };

  /**
   * To reset the password.
   *  - User can only reset the password once.
   *  - If the user wants to reset the password again,
   *    the user should request for a new OTP and verify it.
   * @param {*} email
   * @param {*} newPassword
   */
  resetPassword = async (email, newPassword) => {
    try {
      // if the OTP is not verified
      if (!this.isValidOTP) {
        throw new ApplicationError(
          "OTP is not verified yet. Please verify the OTP.",
          403
        );
      }

      // finding the user from user model
      const user = await UserModel.findOne({ email: email });
      if (!user) {
        throw new ApplicationError("user not found", 404);
      }

      // encrypting the new password and updating
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
      const result = await user.save();

      // resetting the OTP validation param after resetting the password.
      // This will prevent the user to reset password multiple times with a single OTP.
      this.isValidOTP = false;
    } catch (error) {
      console.log(error);
      if (error instanceof ApplicationError) {
        throw error;
      }

      throw new ApplicationError(
        "something went wrong while resetting the password",
        500
      );
    }
  };
}

export default OTPRepository;
