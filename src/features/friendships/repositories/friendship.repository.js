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
      // getting the user who got request
      const userWhoGotRequest = await FriendshipModel.findOne({
        userId: requestedToId,
      });

      // if the user does not exists
      if (!userWhoGotRequest) {
        // adding user
        const newUser = new FriendshipModel({
          userId: requestedToId,
          friends: [],
          pendingRequests: [requesterId],
        });
        await newUser.save();
        return { message: "friend request sent successfully" };
      }

      // checking if request already exists
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

      // if the user exists and request does not exists
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

  /**
   * To get the friends list of the user
   * @param {logged in user's id} userId
   * @returns Array
   */
  getFriends = async (userId) => {
    try {
      // finding the user
      const user = await FriendshipModel.findOne({ userId }).populate(
        "friends"
      );

      // modifying the users details to hide sensitive data (arranging necessary data only)
      const friendsList = user.friends.map((friend) => ({
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

  /**
   * To get the list of friend request in pending
   * @param {logged in user's id} userId
   * @returns Array
   */
  getPendingRequests = async (userId) => {
    try {
      // getting the user from friendship model
      const user = await FriendshipModel.findOne({ userId }).populate(
        "pendingRequests"
      );

      // re-arranging the object
      const friendRequestList = user.pendingRequests.map((request) => {
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

  /**
   * To toggle friendship
   * @param {logged in user's id} userId
   * @param {id of the user to whom the friendship should be toggled} friendId
   * @returns Object
   */
  toggle = async (userId, friendId) => {
    try {
      // getting the user
      const user = await FriendshipModel.findOne({ userId });

      // checking if the friend exists by finding the index of friend
      const friendIndex = user.friends.findIndex(
        (friend) => friend.toString() === friendId
      );

      // adding friend if friend does not exists
      if (friendIndex == -1) {
        user.friends.push(friendId);

        // if this friend is unfriended before
        const unfriendIndex = user.unfriended.findIndex(
          (friend) => friend.toString() === friendId
        );

        // removing the id from the unfriended list
        if (unfriendIndex !== -1) {
          user.unfriended.splice(friendIndex, 1);
        }

        await user.save();
        return { message: "friend added" };
      }

      // removing from friend list
      user.unfriended.push(friendId);
      user.friends.splice(friendIndex, 1);
      await user.save();

      return { message: "unfriended" };
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "Something went wrong while toggling the friendship requests...",
        500
      );
    }
  };

  /**
   * To accept or reject the friend request from the pending requests
   * @param {logged in user's id} userId
   * @param {id of the user who's friendship should be accepted or rejected} friendId
   * @param {type of action(accept or reject)} response
   * @returns Object
   */
  resolveFriendship = async (userId, friendId, response) => {
    try {
      // getting user from friendship model
      const user = await FriendshipModel.findOne({ userId });

      // finding index of pending request
      const requestIndex = user.pendingRequests.findIndex(
        (request) => request.toString() === friendId
      );

      // if request not found
      if (requestIndex === -1) {
        throw new ApplicationError("request not found", 404);
      }

      if (response.toLowerCase().trim() === "accept") {
        /* if user accepts the request */
        // adding to friend list
        user.friends.push(user.pendingRequests[requestIndex]);
        // removing from pending list
        user.pendingRequests.splice(requestIndex, 1);
        await user.save();

        return { message: "request accepted" };
      } else {
        /* if user rejects the request */
        // removing from pending list
        user.pendingRequests.splice(requestIndex, 1);
        // saving the data
        await user.save();
        return { message: "request rejected" };
      }
    } catch (error) {
      console.log(error);
      if (error instanceof ApplicationError) {
        throw error;
      }
      throw new ApplicationError(
        "Something went wrong while accepting/rejecting the pending requests...",
        500
      );
    }
  };
}

export default FriendshipRepository;
