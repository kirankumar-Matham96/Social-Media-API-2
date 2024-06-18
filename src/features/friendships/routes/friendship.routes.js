// package imports
import express from "express";

// module imports
import FriendshipController from "../controllers/friendship.controller.js";

const router = express.Router();
const postController = new FriendshipController();

router.get("/all", (req, res, next) =>
  postController.getAllPosts(req, res, next)
);
router.get("/:postId", (req, res, next) =>
  postController.getPostById(req, res, next)
);
router.get("/", (req, res, next) =>
  postController.getAllUserPosts(req, res, next)
);
router.post("/", (req, res, next) => postController.createPost(req, res, next));
router.delete("/:postId", (req, res, next) =>
  postController.deletePostById(req, res, next)
);
router.put("/:postId", (req, res, next) =>
  postController.updatePostById(req, res, next)
);

export default router;
