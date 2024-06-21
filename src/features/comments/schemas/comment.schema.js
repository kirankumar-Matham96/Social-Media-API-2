import mongoose from "mongoose";

export const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Posts",
  },
  comment: {
    type: String,
    minLength: [
      10,
      "comment should contain min of 10 characters, got '{VALUE}'",
    ],
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Likes",
    },
  ],
});
