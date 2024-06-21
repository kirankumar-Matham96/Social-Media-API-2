// package imports
import mongoose from "mongoose";

// module imports
import { commentSchema } from "../schemas/comment.schema.js";
import { ApplicationError } from "../../../middlewares/errorHandling/customErrorHandling.middleware.js";
import { postsSchema } from "../../posts/schemas/post.schema.js";

// model initializations
const CommentModel = new mongoose.model("Comments", commentSchema);
const PostModel = new mongoose.model("Posts", postsSchema);

/**
 * Repository to handle all the comment related database operation
 */
class CommentRepository {
  /**
   * To get all the comments related to a post
   * @param {post id} postId
   * @returns Array
   */
  get = async (postId) => {
    try {
      const comments = await CommentModel.find({ postId }).populate("userId");
      const modifiedComments = comments.map((comment) => ({
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
      return modifiedComments;
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "Something went wrong while fetching the comments...",
        500
      );
    }
  };

  /**
   * To add a new comment
   * @param {logged in user id} userId
   * @param {post id to which comment should be added} postId
   * @param {comment content} comment
   * @returns Object
   */
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

  /**
   * To update a comment
   * @param {logged in user id} userId
   * @param {id of the comment to be updated} commentId
   * @param {comment content} comment
   * @returns Object
   */
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

  /**
   * To delete a comment
   * @param {id of the comment to be deleted} commentId
   * @returns Object
   */
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

      // deleting the comment
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
