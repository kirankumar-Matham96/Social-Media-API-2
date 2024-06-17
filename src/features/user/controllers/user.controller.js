// package imports
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import "dotenv/config";

// module imports
import UserRepository from "../repositories/user.repository.js";

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
      res.status(500).json({ success: false, error: error.message });
    }
  };

  loginUser = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await this.userRepository.signIn(email);
      if (!user) {
        return res
          .status(400)
          .json({ success: false, error: "user not found" });
      }

      const isValidUser = await bcrypt.compare(password, user.password);

      if (!isValidUser) {
        return res
          .status(400)
          .json({ success: false, error: "invalid credentials" });
      }
    
      const token = jwt.sign(
        { name: user.name, email: user.email, gender: user.gender },
        process.env.SECRET_KEY
      );

      res
        .status(200)
        .json({ success: true, message: "logged in successfully", token });
    } catch (error) {
      console.log(error);
    }
  };

  logoutUser = async (req, res, next) => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  logoutUserFromAllDevices = async (req, res, next) => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  getUserDetails = async () => {
    try {
    } catch (error) {
      console.log(error);
    }
  };
  getAllUsersDetails = async () => {
    try {
    } catch (error) {
      console.log(error);
    }
  };
  UpdateUserDetails = async () => {
    try {
    } catch (error) {
      console.log(error);
    }
  };
}

export default UserController;
