// package imports
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import "dotenv/config";

// module imports
import UserRepository from "../repositories/user.repository.js";
import { ApplicationError } from "../../../middlewares/errorHandling/customErrorHandling.middleware.js";

class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  registerUser = async (req, res, next) => {
    try {
      const { name, email, password, gender } = req.body;
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = { name, email, password: hashedPassword, gender };
      const newUser = await this.userRepository.sigUp(user);

      res
        .status(200)
        .json({ success: true, message: "user added successfully", newUser });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  loginUser = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await this.userRepository.signIn(email);
      const isValidUser = await bcrypt.compare(password, user.password);

      if (!isValidUser) {
        throw new ApplicationError("invalid credentials", 400);
      }

      // token creation
      const token = jwt.sign(
        {
          id: user._id,
          name: user.name,
          email: user.email,
          gender: user.gender,
        },
        process.env.SECRET_KEY
      );

      // storing the token in cookies
      res.cookie("token", token, { maxAge: 60 * 60, httpOnly: true });

      res
        .status(200)
        .json({ success: true, message: "logged in successfully", token });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  logoutUser = (req, res, next) => {
    try {
      // remove the token from the client side cookies
      res.clearCookie("token");
      res.status(200).json({ success: true, message: "logged out!" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  logoutUserFromAllDevices = async (req, res, next) => {
    try {
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getUserDetails = async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await this.userRepository.getUser(id);

      if (!user) {
        throw new ApplicationError("user not found", 404);
      }

      res.status(200).json({ success: true, user });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getAllUsersDetails = async () => {
    try {
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  UpdateUserDetails = async () => {
    try {
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

export default UserController;
