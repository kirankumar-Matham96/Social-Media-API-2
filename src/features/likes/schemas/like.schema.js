import mongoose from "mongoose";

export const likeSchema = new mongoose.Schema({
  likable: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "on_model",
  },
  on_model: {
    type: String,
    enum: {
      values: ["Post", "Comment"],
      message: "{VALUE} is not supported",
    },
  },
});
