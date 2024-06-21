import mongoose from "mongoose";

export const friendshipSchema = new mongoose.Schema({
  userId: {
    unique: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  friends: [
    { unique: true, type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  ],
  pendingRequests: [
    { unique: true, type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  ],
  unfriended: [
    { unique: true, type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  ],
});
