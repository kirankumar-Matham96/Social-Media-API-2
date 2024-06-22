// package imports
import mongoose from "mongoose";
import bcrypt from "bcrypt";

// module imports
import { userSchema } from "../schemas/user.schema.js";
import { ApplicationError } from "../../../middlewares/errorHandling/customErrorHandling.middleware.js";
import { tokenBlockListSchema } from "../schemas/tokenBlocklist.schema.js";
import { logger } from "../../../middlewares/Loggers/userLogger.middleware.js";

/**
 * Repository class to handle all user related database operations.
 */
class UserRepository {
  constructor() {
    this.userModel = new mongoose.model("Users", userSchema);
  }

  /**
   * To register a new user
   * @param {new user data to be registered} userData
   * @returns Object
   */
  sigUp = async (userData) => {
    try {
      const newUser = await this.userModel(userData);
      const userAdded = await newUser.save();
      return userAdded;
    } catch (error) {
      // logging error
      logger.log({ level: "error", error: error });
      if (error.code === 11000) {
        throw new ApplicationError("Email exists already. Please login!", 409);
      }
      throw new ApplicationError(
        "something went wrong while signing up...",
        500
      );
    }
  };

  /**
   * To login a user
   * @param {user email} email
   * @returns Object
   */
  signIn = async (email) => {
    try {
      // finding user by email
      const user = await this.userModel.findOne({ email });

      // if user does not exists
      if (!user) {
        throw new ApplicationError("user not found", 404);
      }

      return user;
    } catch (error) {
      logger.log({ level: "error", error: error });
      if (error instanceof ApplicationError) {
        throw error;
      }

      throw new ApplicationError(
        "something went wrong while signing in...",
        500
      );
    }
  };

  /**
   * To logout a user.
   *  - The JWT used for the login will be added to the blocklist.
   * @param {JWT} token
   */
  signOut = async (token) => {
    try {
      // initializing the blocklist token model
      const TokenModel = new mongoose.model(
        "BlocklistTokens",
        tokenBlockListSchema
      );

      // adding the token to the blocklist
      const blockedToken = TokenModel({ token });
      await blockedToken.save();
    } catch (error) {
      logger.log({ level: "error", error: error });
      throw error;
    }
  };

  /**
   * To logout from all the devices.
   *  - Token version will be updated for the specific user,
   *    so that user will not be performing any operations from any device.
   * @param {*} userId
   */
  signOutAll = async (userId) => {
    try {
      // get user from user model
      const user = await this.userModel.findById(userId);

      // increasing the token version
      user.tokenVersion++;
      user.save();
    } catch (error) {
      logger.log({ level: "error", error: error });
      throw error;
    }
  };

  /**
   * To get user data.
   * @param {id of the loggedin user} userId
   * @returns Object
   */
  getUser = async (userId) => {
    try {
      // getting user
      const user = await this.userModel.findById(userId);

      // modifying user object
      const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
      };
      return userData;
    } catch (error) {
      logger.log({ level: "error", error: error });
      throw new ApplicationError(
        "something went wrong while fetching user details...",
        500
      );
    }
  };

  /**
   * To get all the users
   * @returns Array
   */
  getUsers = async () => {
    try {
      // getting the users
      const users = await this.userModel.find();

      // modifying the objects
      const usersList = users.map((user) => {
        return {
          name: user.name,
          email: user.email,
          gender: user.gender,
        };
      });

      return usersList;
    } catch (error) {
      logger.log({ level: "error", error: error });
      throw new ApplicationError(
        "something went wrong while fetching user details...",
        500
      );
    }
  };

  /**
   * To update the user
   * @param {id of the loggedin user} userId
   * @param {new data f the user} newData
   * @returns Object
   */
  update = async (userId, newData) => {
    try {
      // getting the user
      const user = await this.userModel.findById(userId);

      /* updating the user data */
      if (newData.name) {
        user.name = newData.name;
      }
      if (newData.email) {
        user.email = newData.email;
      }
      if (newData.password) {
        // hashing the new password
        const hashedPass = await bcrypt.hash(newData.password, 12);
        user.password = hashedPass;
      }
      if (newData.gender) {
        user.gender = newData.gender;
      }
      const updatedUser = await user.save();

      return updatedUser;
    } catch (error) {
      logger.log({ level: "error", error: error });
      throw new ApplicationError(
        "something went wrong while updating the user details...",
        500
      );
    }
  };
}

export default UserRepository;
