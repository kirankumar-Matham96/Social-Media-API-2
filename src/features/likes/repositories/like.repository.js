// package imports
import mongoose from "mongoose";

// module imports
import { likeSchema } from "../schemas/like.schema.js";
import { postsSchema } from "../../posts/schemas/post.schema.js";
import { commentSchema } from "../../comments/schemas/comment.schema.js";
import { ApplicationError } from "../../../middlewares/errorHandling/customErrorHandling.middleware.js";

const LikeModel = new mongoose.model("Likes", likeSchema);
const PostsModel = new mongoose.model("Posts", postsSchema);
const CommentModel = new mongoose.model("Comments", commentSchema);

class LikeRepository {
  toggle = async (userId, id, type) => {
    try {
      const like = await LikeModel.findOne({ likable: id });

      if (!like) {
        // creating a new like
        const newLike = new LikeModel({
          likedBy: userId,
          likable: id,
          on_model: type,
        });
        await newLike.save();

        if (type === "Post") {
          // updating related post
          const postFound = await PostsModel.findById(id);
          if (!postFound) {
            throw new ApplicationError(`post not found with the id ${id}`);
          }
          postFound.likes.push(newLike._id);
          await postFound.save();
        }

        if (type === "Comment") {
          // updating related comment
          const commentFound = await CommentModel.findById(id);
          if (!commentFound) {
            throw new ApplicationError(`comment not found with the id ${id}`);
          }
          commentFound.likes.push(newLike._id);
          await commentFound.save();
        }

        return { message: "liked", newLike };
      }

      /* deleting the like from related post/comment */
      if (type === "Post") {
        // updating related post
        const postFound = await PostsModel.findById(id);
        if (!postFound) {
          throw new ApplicationError(`post not found with the id ${id}`);
        }
        console.log("in like repo => ", like._id);
        const likeIndex = postFound.likes.findIndex(
          (likeId) => likeId.toString() == like._id
        );

        postFound.likes.splice(likeIndex, 1);

        await postFound.save();
      }

      if (type === "Comment") {
        // updating related comment
        const commentFound = await CommentModel.findById(id);
        if (!commentFound) {
          throw new ApplicationError(`comment not found with the id ${id}`);
        }
        console.log("in like repo => ", like._id);
        const likeIndex = commentFound.likes.findIndex(
          (likeId) => likeId.toString() == like._id
        );

        commentFound.likes.splice(likeIndex, 1);
        await commentFound.save();
      }

      await LikeModel.deleteOne({ likable: id });

      return { message: "disliked" };
    } catch (error) {
      console.log(error);

      if (error instanceof ApplicationError) {
        throw error;
      }

      throw new ApplicationError(
        "Something went wrong while fetching the comments...",
        500
      );
    }
  };

  get = async (id, type) => {
    try {
      const likes = await LikeModel.find({ likable: id }).populate("likedBy");
      const modifiedLikes = likes.map((like) => ({
        likeId: like._id,
        likable: like.likable,
        user: {
          name: like.likedBy.name,
          email: like.likedBy.email,
          gender: like.likedBy.gender,
        },
        onModel: like.on_model,
      }));
      return modifiedLikes;
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "Something went wrong while fetching the comments...",
        500
      );
    }
  };
}

export default LikeRepository;
