import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, "name should contain min of 3 characters, got '{VALUE}'"],
    required: [true, "name is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    validate: {
      validator: (email) => {
        return /[A-Za-z0-9\._%+\-]+@[A-Za-z0-9\.\-]+\.[A-Za-z]{2,}/.test(email);
      },
      message: "invalid email",
    },
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minLength: [8, "min of 8 characters required, got '{VALUE}'"],
  },
  gender: {
    type: String,
    required: [true, "gender is required"],
    enum: {
      values: ["Male", "Female", "Others"],
      message: "'{VALUE}' is not supported",
    },
  },
});
