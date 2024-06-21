// package imports
import express from "express";

// module imports
import FriendshipController from "../controllers/friendship.controller.js";

const router = express.Router();
const friendshipController = new FriendshipController();

router.post("/send-request/:userId", (req, res, next) =>
  friendshipController.addRequestToPendingList(req, res, next)
);

router.get("/get-friends/:userId", (req, res, next) =>
  friendshipController.getFriendsList(req, res, next)
);

router.get("/get-pending-requests", (req, res, next) =>
  friendshipController.getRequests(req, res, next)
);

router.get("/toggle-friendship/:friendId", (req, res, next) =>
  friendshipController.toggleFriendship(req, res, next)
);

router.get("/response-to-request/:friendId", (req, res, next) =>
  friendshipController.acceptOrRejectFriendRequest(req, res, next)
);
export default router;
