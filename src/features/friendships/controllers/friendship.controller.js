// module imports
import FriendshipRepository from "../repositories/friendship.repository.js";

/**
 * Controller to handle all the requests related to the friendship
 */
class FriendshipController {
  constructor() {
    this.friendshipRepository = new FriendshipRepository();
  }

  /**
   * To send a friend request
   * @param {request} req
   * @param {response} res
   * @param {next middleware callback} next
   */
  addRequestToPendingList = async (req, res, next) => {
    try {
      const { userId: requestingUserId } = req;
      const { userId: userIdRequestedTo } = req.params;

      const requestResult = await this.friendshipRepository.addRequest(
        requestingUserId,
        userIdRequestedTo
      );

      res.status(201).json({ success: true, message: requestResult.message });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  /**
   * To get all friends
   * @param {request} req
   * @param {response} res
   * @param {next middleware callback} next
   */
  getFriendsList = async (req, res, next) => {
    try {
      const { userId } = req;
      const friendsList = await this.friendshipRepository.getFriends(userId);

      res.status(200).json({
        success: true,
        message: "Friends fetched successfully",
        friendsList,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  /**
   * To get all friend requests
   * @param {request} req
   * @param {response} res
   * @param {next middleware callback} next
   */
  getRequests = async (req, res, next) => {
    try {
      const { userId } = req;
      const requestsList = await this.friendshipRepository.getPendingRequests(
        userId
      );

      res.status(200).json({
        success: true,
        message: "Requests fetched successfully",
        requestsList,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  /**
   * To add or remove friend
   * @param {request} req
   * @param {response} res
   * @param {next middleware callback} next
   */
  toggleFriendship = async (req, res, next) => {
    try {
      const { userId } = req;
      const { friendId } = req.params;
      const requestsList = await this.friendshipRepository.toggle(
        userId,
        friendId
      );

      res.status(200).json({
        success: true,
        message: requestsList.message,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  /**
   * To accept or reject friend request
   * @param {request} req
   * @param {response} res
   * @param {next middleware callback} next
   */
  acceptOrRejectFriendRequest = async (req, res, next) => {
    try {
      const { userId } = req;
      const { friendId } = req.params;
      const { response } = req.query;
      const requestStatus = await this.friendshipRepository.resolveFriendship(
        userId,
        friendId,
        response
      );

      res.status(200).json({
        success: true,
        message: requestStatus.message,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

export default FriendshipController;
