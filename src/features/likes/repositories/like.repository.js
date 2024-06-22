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

/**
 * Repository class to handle all like related database operations.
 */
class LikeRepository {
  /**
   * 
   * @param {id of the logged in user} userId 
   * @param {id of the comment or post who's like to be toggled} id 
   * @param {type of entity (post or comment)} type 
   * @returns Object
   */
  toggle = async (userId, id, type) => {
    try {
      // finding like from like model
      const like = await LikeModel.findOne({ likable: id });

      // if like does not exists
      if (!like) {
        // creating a new like
        const newLike = new LikeModel({
          likedBy: userId,
          likable: id,
          on_model: type,
        });
        await newLike.save();

        /* updating related entity */
        // updating related post
        if (type === "Post") {
          const postFound = await PostsModel.findById(id);
          if (!postFound) {
            throw new ApplicationError(`post not found with the id ${id}`);
          }
          postFound.likes.push(newLike._id);
          await postFound.save();
        }

        // updating related comment
        if (type === "Comment") {
          const commentFound = await CommentModel.findById(id);
          if (!commentFound) {
            throw new ApplicationError(`comment not found with the id ${id}`);
          }
          commentFound.likes.push(newLike._id);
          await commentFound.save();
        }

        return { message: "liked", newLike };
      }
      
      // if the like exists already
      /* deleting the like from related post/comment */
      // updating related post
      if (type === "Post") {
        const postFound = await PostsModel.findById(id);
        if (!postFound) {
          throw new ApplicationError(`post not found with the id ${id}`);
        }
        const likeIndex = postFound.likes.findIndex(
          (likeId) => likeId.toString() == like._id
        );
        postFound.likes.splice(likeIndex, 1);
        await postFound.save();
      }

      // updating related comment
      if (type === "Comment") {
        const commentFound = await CommentModel.findById(id);
        if (!commentFound) {
          throw new ApplicationError(`comment not found with the id ${id}`);
        }
        const likeIndex = commentFound.likes.findIndex(
          (likeId) => likeId.toString() == like._id
        );
        commentFound.likes.splice(likeIndex, 1);
        await commentFound.save();
      }

      // deleting the like from like model
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

  /**
   * To get the likes of a comment or post by it's id
   * @param {id of the entity (post or comment)} id 
   * @returns Object
   */
  get = async (id) => {
    try {
      // getting likes from likes model
      const likes = await LikeModel.find({ likable: id }).populate("likedBy");
      
      // modifying the object
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
