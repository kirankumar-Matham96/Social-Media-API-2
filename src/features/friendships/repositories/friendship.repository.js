// package imports
import mongoose from "mongoose";

// module imports
import { friendshipSchema } from "../schemas/friendship.schema.js";
import { ApplicationError } from "../../../middlewares/errorHandling/customErrorHandling.middleware.js";

const FriendshipModel = new mongoose.model("Posts", friendshipSchema);

class FriendshipRepository {
  getFriends = async (userId) => {
    try {
      const friends = await FriendshipModel.find({ userId });
      return friends.friends;
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "Something went wrong while fetching the friends list...",
        500
      );
    }
  };

  getPendingRequests = async (userId) => {
    try {
      const friends = await FriendshipModel.find({ userId });
      return friends.pendingRequests;
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "Something went wrong while fetching the pending requests...",
        500
      );
    }
  };

  toggle = async (userId, friendId) => {
    try {
      const friendship = await FriendshipModel.findById(userId);
      const friendIndex = friendship.friends.findIndex(friendId);
      if (!friendIndex) {
        friendship.friends.push(friendId);
        await friendship.save();
        return { message: "friend added" };
      }

      friendship.friends.splice(friendIndex, 1);
      await friendship.save();

      return { message: "unfriended" };
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "Something went wrong while toggling the friendship requests...",
        500
      );
    }
  };

  resolveFriendship = async (userId, friendId) => {
    try {
      const friendship = await FriendshipModel.find({ userId });
      const requestIndex = friendship.pendingRequests.findIndex(friendId);
      

    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "Something went wrong while accepting/rejecting the pending requests...",
        500
      );
    }
  };
}

export default FriendshipRepository;
