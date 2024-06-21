// package imports
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
import bcrypt from "bcrypt";

// module imports
import { userSchema } from "../../user/schemas/user.schema.js";
import { ApplicationError } from "../../../middlewares/errorHandling/customErrorHandling.middleware.js";

const UserModel = new mongoose.model("Users", userSchema);

class OTPRepository {
  constructor() {
    this.isValidOTP = false;
  }

  generateOTP = () => {
    this.otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: true,
      upperCaseAlphabets: true,
    });
    return this.otp;
  };

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

  verifyOtp = (otp, email) => {
    try {
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

  resetPassword = async (email, newPassword) => {
    try {
      // if the OTP is not verified
      if (!this.isValidOTP) {
        throw new ApplicationError(
          "OTP is not verified yet. Please verify the OTP.",
          403
        );
      }

      const user = await UserModel.findOne({ email: email });
      if (!user) {
        throw new ApplicationError("user not found", 404);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
      const result = await user.save();
      // resetting the OTP validation param after resetting the password
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
