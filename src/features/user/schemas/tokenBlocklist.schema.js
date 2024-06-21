import mongoose from "mongoose";

export const tokenBlockListSchema = new mongoose.Schema({
  token: {
    type: String,
  },
});
