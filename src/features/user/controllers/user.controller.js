// package imports
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// module imports
import UserRepository from "../repositories/user.repository.js";
import { ApplicationError } from "../../../middlewares/errorHandling/customErrorHandling.middleware.js";

/**
 * Controller class to handle all the requests related to user.
 */
class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * To register a new user
   * @param {request} req
   * @param {response} res
   * @param {next middleware callback} next
   */
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

  /**
   * To login an existing user
   * @param {request} req
   * @param {response} res
   * @param {next middleware callback} next
   */
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
          version: user.tokenVersion, // to track token version(it is helpful to logout user from all the devices).
        },
        process.env.SECRET_KEY,
        { expiresIn: "1 day" }
      );

      res
        .status(200)
        .json({ success: true, message: "logged in successfully", token });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  /**
   * To logout a user
   * @param {request} req
   * @param {response} res
   * @param {next middleware callback} next
   */
  logoutUser = async (req, res, next) => {
    try {
      const { authorization } = req.headers;
      const token = authorization.split(" ")[1];

      await this.userRepository.signOut(token);

      res.status(200).json({ success: true, message: "logged out!" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  /**
   * To logout a user from all the devices
   * @param {request} req
   * @param {response} res
   * @param {next middleware callback} next
   */
  logoutUserFromAllDevices = async (req, res, next) => {
    try {
      const { userId } = req;
      console.log("\n\n\nin controller=. ", { userId }, "\n\n\n");

      await this.userRepository.signOutAll(userId);
      res.status(200).json({
        success: true,
        message: "User logged out from all the devices",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  /**
   * To get a user's details
   * @param {request} req
   * @param {response} res
   * @param {next middleware callback} next
   */
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

  /**
   * To get all the users details
   * @param {request} req
   * @param {response} res
   * @param {next middleware callback} next
   */
  getAllUsersDetails = async (req, res, next) => {
    try {
      const users = await this.userRepository.getUsers();
      res
        .status(200)
        .json({ success: true, message: "fetched all the users", users });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  /**
   * To update a user
   * @param {request} req
   * @param {response} res
   * @param {next middleware callback} next
   */
  UpdateUserDetails = async (req, res, next) => {
    try {
      const { userId } = req;
      let { name, email, password, gender } = req.body;
      if (gender) {
        req.body.gender = gender.toUpperCase().slice(0, 1) + gender.slice(1);
      }
      const updatedUser = await this.userRepository.update(userId, req.body);
      res.status(200).json({
        success: true,
        message: "user data updated successfully",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

export default UserController;
