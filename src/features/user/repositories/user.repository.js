// package imports
import mongoose from "mongoose";
import bcrypt from "bcrypt";

// module imports
import { userSchema } from "../schemas/user.schema.js";
import { ApplicationError } from "../../../middlewares/errorHandling/customErrorHandling.middleware.js";
import { tokenBlockListSchema } from "../schemas/tokenBlocklist.schema.js";

class UserRepository {
  constructor() {
    this.userModel = new mongoose.model("Users", userSchema);
  }
  sigUp = async (userData) => {
    try {
      const newUser = await this.userModel(userData);
      const userAdded = await newUser.save();
      return userAdded;
    } catch (error) {
      console.log({ error });
      if (error.code === 11000) {
        throw new ApplicationError("Email exists already. Please login!", 409);
      }
      throw new ApplicationError(
        "something went wrong while signing up...",
        500
      );
    }
  };

  signIn = async (email) => {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new ApplicationError("user not found", 404);
      }
      return user;
    } catch (error) {
      console.log(error);

      if (error instanceof ApplicationError) {
        throw error;
      }

      throw new ApplicationError(
        "something went wrong while signing in...",
        500
      );
    }
  };

  signOut = async (token) => {
    try {
      const TokenModel = new mongoose.model(
        "BlocklistTokens",
        tokenBlockListSchema
      );
      const blockedToken = TokenModel({ token });
      await blockedToken.save();
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  signOutAll = async (userId) => {
    try {
      console.log("\n\n\n", { userId }, "\n\n\n");
      const user = await this.userModel.findById(userId);
      console.log("\n\n\n", { user }, "\n\n\n");
      user.tokenVersion++;
      user.save();
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  getUser = async (userId) => {
    try {
      const user = await this.userModel.findById(userId);
      const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
      };
      return userData;
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "something went wrong while fetching user details...",
        500
      );
    }
  };

  getUsers = async () => {
    try {
      const users = await this.userModel.find();
      const usersList = users.map((user) => {
        return {
          name: user.name,
          email: user.email,
          gender: user.gender,
        };
      });

      return usersList;
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "something went wrong while fetching user details...",
        500
      );
    }
  };

  update = async (userId, newData) => {
    try {
      const updatedUser = await this.userModel.findById(userId);
      if (newData.name) {
        updatedUser.name = newData.name;
      }
      if (newData.email) {
        updatedUser.email = newData.email;
      }
      if (newData.password) {
        const hashedPass = await bcrypt.hash(newData.password, 12);
        updatedUser.password = hashedPass;
      }
      if (newData.gender) {
        updatedUser.gender = newData.gender;
      }
      await updatedUser.save();

      return updatedUser;
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "something went wrong while updating the user details...",
        500
      );
    }
  };

  resetPassword = async (userId, newPassword) => {
    try {
      const user = await this.userModel.findById(userId);
      console.log({ user });
      return user;
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "something went wrong while resetting the user password...",
        500
      );
    }
  };
}

export default UserRepository;
