// package imports
import mongoose from "mongoose";

// module imports
import { friendshipSchema } from "../schemas/friendship.schema.js";
import { ApplicationError } from "../../../middlewares/errorHandling/customErrorHandling.middleware.js";

// model initialization
const FriendshipModel = new mongoose.model("Friendship", friendshipSchema);

/**
 * Repository to handle all friendship related database operations
 */
class FriendshipRepository {
  /**
   * To send the friend request
   * @param {id of the user who send the friend request} requesterId 
   * @param {id of the user who receive the friend request} requestedToId 
   * @returns 
   */
  addRequest = async (requesterId, requestedToId) => {
    try {
      const userWhoGotRequest = await FriendshipModel.findOne({
        userId: requestedToId,
      });

      if (!userWhoGotRequest) {
        const newUser = new FriendshipModel({
          userId: requestedToId,
          friends: [],
          pendingRequests: [requesterId],
        });
        await newUser.save();
        return { message: "friend request sent successfully" };
      }

      const ifRequestExists = userWhoGotRequest.pendingRequests.findIndex(
        (request) => requesterId === request.toString()
      );

      // if the request exists already
      if (ifRequestExists != -1) {
        throw new ApplicationError(
          "A friend request already sent to this user",
          400
        );
      }

      userWhoGotRequest.pendingRequests.push(requesterId);
      await userWhoGotRequest.save();

      return { message: "friend request sent successfully" };
    } catch (error) {
      console.log(error);

      if (error instanceof ApplicationError) {
        throw error;
      }

      throw new ApplicationError(
        "Something went wrong while fetching the friends list...",
        500
      );
    }
  };

  getFriends = async (userId) => {
    try {
      const friends = await FriendshipModel.findOne({ userId }).populate(
        "friends"
      );

      const friendsList = friends.friends.map((friend) => ({
        id: friend._id,
        name: friend.name,
        email: friend.email,
        gender: friend.gender,
      }));

      return friendsList;
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
      const requests = await FriendshipModel.findOne({ userId }).populate(
        "pendingRequests"
      );

      const friendRequestList = requests.pendingRequests.map((request) => {
        const modifiedRequest = {
          name: request.name,
          email: request.email,
          gender: request.gender,
          id: request._id,
        };

        return modifiedRequest;
      });

      return friendRequestList;
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
      const friendship = await FriendshipModel.findOne({ userId });
      console.log("\n\nin friend repo => ", { friendship }, "\n\n");
      const friendIndex = friendship.friends.findIndex(
        (friend) => friend.toString() === friendId
      );
      console.log("\n\nin friend repo => ", { friendIndex }, "\n\n");

      // adding friend
      if (friendIndex == -1) {
        friendship.friends.push(friendId);

        // if this friend is unfriended before
        const unfriendIndex = friendship.unfriended.findIndex(
          (friend) => friend.toString() === friendId
        );
        // removing the id from the unfriended list
        if (unfriendIndex !== -1) {
          friendship.unfriended.splice(friendIndex, 1);
        }

        await friendship.save();
        return { message: "friend added" };
      }

      // removing from friend list
      friendship.unfriended.push(friendId);
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

  resolveFriendship = async (userId, friendId, response) => {
    try {
      const friendship = await FriendshipModel.findOne({ userId });
      console.log("pending requests => ", friendship.pendingRequests);
      const requestIndex = friendship.pendingRequests.findIndex(
        (request) => request.toString() === friendId
      );

      // if request not found
      if (requestIndex === -1) {
        return { message: "request not found" };
      }

      if (response.toLowerCase().trim() === "accept") {
        // adding to friend list
        friendship.friends.push(friendship.pendingRequests[requestIndex]);
        // removing from pending list
        friendship.pendingRequests.splice(requestIndex, 1);
        // saving the data
        await friendship.save();

        return { message: "request accepted" };
      } else {
        // removing from pending list
        friendship.pendingRequests.splice(requestIndex, 1);
        // saving the data
        await friendship.save();
        return { message: "request rejected" };
      }
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
