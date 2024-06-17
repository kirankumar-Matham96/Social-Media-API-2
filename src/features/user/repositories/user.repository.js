// package imports
import mongoose from "mongoose";

// module imports
import { userSchema } from "../schemas/user.schema.js";

class UserRepository {
  sigUp = async (userData) => {
    try {
      const userModel = new mongoose.model("Users", userSchema);
      const newUser = await userModel(userData);
      const userAdded = await newUser.save();
      return userAdded;
    } catch (error) {
      console.log({ error });
      throw error;
    }
  };
}

export default UserRepository;
