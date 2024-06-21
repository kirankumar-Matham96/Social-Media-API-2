// package imports
import express from "express";

// module imports
import CommentController from "../controllers/comment.controller.js";
import CommentValidationMiddleware from "../../../middlewares/validations/comment/commentValidation.middleware.js";

// router initialization
const router = express.Router();

// initializations
const commentValidationMiddleware = new CommentValidationMiddleware();
const commentController = new CommentController();

// route to get all comments of the post by post id
router.get("/:postId", (req, res, next) =>
  commentController.getComments(req, res, next)
);

// route to create a new comment by post id
router.post(
  "/:postId",
  (req, res, next) =>
    commentValidationMiddleware.commentValidation(req, res, next),
  (req, res, next) => commentController.createComment(req, res, next)
);

// route to update the comment by comment id
router.put("/:commentId", (req, res, next) =>
  commentController.updateComment(req, res, next)
);

// route to delete the comment by comment id
router.delete("/:commentId", (req, res, next) =>
  commentController.deleteComment(req, res, next)
);

export default router;
