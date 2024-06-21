// module imports
import CommentRepository from "../repositories/comment.repository.js";

class CommentController {
  constructor() {
    this.commentRepository = new CommentRepository();
  }

  createComment = async (req, res, next) => {
    try {
      const { userId } = req;
      const { postId } = req.params;
      const { content } = req.body;
      const newComment = await this.commentRepository.create(
        userId,
        postId,
        content
      );

      res.status(201).json({
        success: true,
        message: "comment added successfully",
        newPost: newComment,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  updateComment = async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const { content } = req.body;
      const { userId } = req;
      console.log("in comment controller => ", { content });
      const updatedComment = await this.commentRepository.update(
        userId,
        commentId,
        content
      );

      res.status(200).json({
        success: true,
        message: "comment updated successfully",
        newPost: updatedComment,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getComments = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const comments = await this.commentRepository.get(postId);

      res.status(200).json({
        success: true,
        message: "comment retrieved successfully",
        comments,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  deleteComment = async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const { userId } = req;
      const deletedComment = await this.commentRepository.delete(
        userId,
        commentId
      );

      res.status(200).json({
        success: true,
        message: "comment deleted successfully",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

export default CommentController;
