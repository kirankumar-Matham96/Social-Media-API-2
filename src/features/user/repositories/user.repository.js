// package imports
import mongoose from "mongoose";

// module imports
import { userSchema } from "../schemas/user.schema.js";
import { ApplicationError } from "../../../middlewares/errorHandling/customErrorHandling.middleware.js";

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
      throw new ApplicationError(
        "something went wrong while signing in...",
        500
      );
    }
  };
}

export default UserRepository;
