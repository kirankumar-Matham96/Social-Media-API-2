// module imports
import CommentRepository from "../repositories/comment.repository.js";

class CommentController {
  constructor() {
    this.commentRepository = new CommentRepository();
  }

  createComment = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { comment } = req.body;
      const newComment = await this.commentRepository.create(postId, comment);

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
      const { comment } = req.body;
      const updatedComment = await this.commentRepository.update(
        commentId,
        comment
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
        newPost: comments,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  deleteComment = async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const deletedComment = await this.commentRepository.delete(commentId);

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
