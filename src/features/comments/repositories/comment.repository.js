// package imports
import mongoose from "mongoose";

// module imports
import { commentSchema } from "../schemas/comment.schema.js";
import { ApplicationError } from "../../../middlewares/errorHandling/customErrorHandling.middleware.js";

const CommentModel = new mongoose.model("Comments", commentSchema);

class CommentRepository {
  get = async (postId) => {
    try {
      const comments = await CommentModel.find({ postId });
      return comments;
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "Something went wrong while fetching the comments...",
        500
      );
    }
  };

  create = async (postId, comment) => {
    try {
      const newComment = new CommentModel({ postId, comment });
      await newComment.save();
      return newComment;
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "Something went wrong while creating the comment...",
        500
      );
    }
  };

  update = async (commentId, comment) => {
    try {
      const comment = await CommentModel.findById(commentId);
      comment.comment = comment;
      await comment.save();
      return comment;
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "Something went wrong while updating the comment...",
        500
      );
    }
  };

  delete = async (commentId) => {
    try {
      const comment = await CommentModel.findByIdAndDelete(commentId);
      return comment;
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "Something went wrong while deleting the comment...",
        500
      );
    }
  };
}

export default CommentRepository;
