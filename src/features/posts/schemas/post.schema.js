import mongoose from "mongoose";

export const postsSchema = new mongoose.Schema({
  caption: {
    type: String,
    minLength: [5, "caption should contain min of 5 characters, got '{VALUE}'"],
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comments",
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Likes",
    },
  ],
});
