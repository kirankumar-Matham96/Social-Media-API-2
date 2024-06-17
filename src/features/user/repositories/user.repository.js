// package imports
import mongoose from "mongoose";

// module imports
import { userSchema } from "../schemas/user.schema.js";

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
      throw error;
    }
  };

  signIn = async (email) => {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        return false;
      }
      return user;
    } catch (error) {
      console.log(error);
    }
  };
}

export default UserRepository;
