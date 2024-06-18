// package imports
import express from "express";

// module imports
import CommentController from "../controllers/comment.controller.js";

const router = express.Router();
const commentController = new CommentController();

router.get("/:postId", (req, res, next) =>
  commentController.getComments(req, res, next)
);
router.post("/:postId", (req, res, next) =>
  commentController.createComment(req, res, next)
);
router.put("/:commentId", (req, res, next) =>
  commentController.updateComment(req, res, next)
);
router.delete("/:commentId", (req, res, next) =>
  commentController.deleteComment(req, res, next)
);

export default router;
