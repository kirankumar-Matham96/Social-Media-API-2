// package imports
import bcrypt from "bcrypt";

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
