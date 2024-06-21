// package imports
import mongoose from "mongoose";

// module imports
import { commentSchema } from "../schemas/comment.schema.js";
import { ApplicationError } from "../../../middlewares/errorHandling/customErrorHandling.middleware.js";
import { postsSchema } from "../../posts/schemas/post.schema.js";

const CommentModel = new mongoose.model("Comments", commentSchema);
const PostModel = new mongoose.model("Posts", postsSchema);

class CommentRepository {
  get = async (postId) => {
    try {
      const comments = await CommentModel.find({ postId }).populate("userId");
      const modifiedComment = comments.map((comment) => ({
        commentId: comment._id,
        postId: comment.postId,
        user: {
          name: comment.userId.name,
          email: comment.userId.email,
          gender: comment.userId.gender,
        },
        commentContent: comment.comment,
        likes: comment.likes,
      }));
      return modifiedComment;
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "Something went wrong while fetching the comments...",
        500
      );
    }
  };

  create = async (userId, postId, comment) => {
    try {
      // creating a new comment
      const newComment = new CommentModel({ userId, postId, comment });
      await newComment.save();

      // updating the relative post
      const foundPost = await PostModel.findById(postId);
      foundPost.comments.push(newComment._id);
      await foundPost.save();

      return newComment;
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "Something went wrong while creating the comment...",
        500
      );
    }
  };

  update = async (userId, commentId, comment) => {
    try {
      const foundComment = await CommentModel.findById(commentId);
      const post = await PostModel.findById(foundComment.postId);
      // checking if the user is comment creator or post creator
      if (
        foundComment.userId.toString() !== userId ||
        foundComment.userId.toString() !== post.userId
      ) {
        throw new ApplicationError(
          "user not allowed to update this comment",
          403
        );
      }

      // foundComment
      foundComment.comment = comment;
      const updatedComment = await foundComment.save();
      return updatedComment;
    } catch (error) {
      console.log(error);
      if (error instanceof ApplicationError) {
        throw error;
      }

      throw new ApplicationError(
        "Something went wrong while updating the comment...",
        500
      );
    }
  };

  delete = async (commentId) => {
    try {
      // deleting the comment
      const comment = await CommentModel.findById(commentId);
      const foundPost = await PostModel.findById(comment.postId);

      // checking if the user is comment creator or post creator
      if (
        comment.userId.toString() !== userId ||
        comment.userId.toString() !== foundPost.userId
      ) {
        throw new ApplicationError(
          "user not allowed to update this comment",
          403
        );
      }

      // checking if the post exists
      if (!foundPost) {
        throw new ApplicationError("comment related post not found", 404);
      }

      // updating the relative post
      const commentIndex = foundPost.comments.findIndex((comment) => {
        return comment.toString() === commentId;
      });

      // checking if the comment exists in the post
      if (commentIndex == -1) {
        throw new ApplicationError(
          "comment not found in the related post",
          404
        );
      }

      foundPost.comments.splice(commentIndex, 1);
      await foundPost.save();

      const deletedComment = await CommentModel.findByIdAndDelete(commentId);

      return deletedComment;
    } catch (error) {
      console.log(error);

      if (error instanceof ApplicationError) {
        throw error;
      }

      throw new ApplicationError(
        "Something went wrong while deleting the comment...",
        500
      );
    }
  };
}

export default CommentRepository;
