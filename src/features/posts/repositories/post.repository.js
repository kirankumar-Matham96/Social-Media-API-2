// package imports
import mongoose from "mongoose";

// module imports
import { postsSchema } from "../schemas/post.schema.js";
import { ApplicationError } from "../../../middlewares/errorHandling/customErrorHandling.middleware.js";

// initializing post model
const PostModel = new mongoose.model("Posts", postsSchema);

/**
 * Repository class to handle all the post related database operations.
 */
class PostRepository {
  /**
   * To get all the posts
   * @returns Array
   */
  getAllPosts = async () => {
    try {
      // getting the posts
      const posts = await PostModel.find().populate("userId");

      // modifying the posts object
      const modifiedPosts = posts.map((post) => ({
        postId: post._id,
        user: {
          name: post.userId.name,
          email: post.userId.email,
          gender: post.userId.gender,
        },
        caption: post.caption,
        imageUrl: post.imageUrl,
        comments: post.comments,
        likes: post.likes,
      }));

      return modifiedPosts;
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "Something went wrong while fetching the posts...",
        500
      );
    }
  };

  /**
   * To get all the posts of the current user.
   * @param {id of the loggedin use} userId
   * @returns Array
   */
  getUserPosts = async (userId) => {
    try {
      // getting the posts of the user
      const posts = await PostModel.find({ userId }).populate("userId");

      // modifying the posts object
      const modifiedPosts = posts.map((post) => ({
        postId: post._id,
        user: {
          name: post.userId.name,
          email: post.userId.email,
          gender: post.userId.gender,
        },
        caption: post.caption,
        imageUrl: post.imageUrl,
        comments: post.comments,
        likes: post.likes,
      }));

      return modifiedPosts;
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "Something went wrong while fetching the posts...",
        500
      );
    }
  };

  /**
   * To get the post by id
   * @param {id of the post} postId
   * @returns Object
   */
  get = async (postId) => {
    try {
      const post = await PostModel.findById(postId).populate("userId");
      const modifiedPost = {
        postId: post._id,
        user: {
          name: post.userId.name,
          email: post.userId.email,
          gender: post.userId.gender,
        },
        caption: post.caption,
        imageUrl: post.imageUrl,
        comments: post.comments,
        likes: post.likes,
      };

      return modifiedPost;
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "Something went wrong while fetching the posts...",
        500
      );
    }
  };

  /**
   * To create a new post
   * @param {content of the post} postDetails
   * @param {id of the loggedin user} userId
   * @returns Object
   */
  create = async (postDetails, userId) => {
    try {
      // creating the post
      const post = new PostModel({ ...postDetails, userId });
      return await post.save();
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "Something went wrong while creating the post...",
        500
      );
    }
  };

  /**
   * To delete the post by id
   * @param {id of the loggedin user} userId
   * @param {id of the post to be deleted} postId
   * @returns
   */
  delete = async (userId, postId) => {
    try {
      // finding the post
      const postFound = await PostModel.findById(postId);
      if (!postFound) {
        throw new ApplicationError("post not found", 404);
      }

      // if the user tries to delete other user's post
      const isUserValid = postFound.userId.toString() === userId;
      if (!isUserValid) {
        throw new ApplicationError("user not allowed to delete this post", 403);
      }

      // deleting the post
      const post = await PostModel.findByIdAndDelete(postId);
      return { message: "post deleted successfully" };
    } catch (error) {
      console.log(error);
      if (error instanceof ApplicationError) {
        throw error;
      }

      throw new ApplicationError(
        "something went wrong while deleting the post...",
        500
      );
    }
  };

  /**
   * To update the post by id.
   * @param {id of the loggedin user} userId
   * @param {id of the post to be updated} postId
   * @param {post content} postData
   * @returns Object
   */
  update = async (userId, postId, postData) => {
    try {
      const post = await PostModel.findById(postId);
      // if the user tries to update other user's post
      const isUserValid = post.userId.toString() === userId;
      if (!isUserValid) {
        throw new ApplicationError("user not allowed to update this post", 403);
      }

      // updating the post data
      if (postData.caption) {
        post.caption = postData.caption;
      }
      if (postData.content) {
        post.content = postData.content;
      }
      if (postData.imageUrl) {
        post.imageUrl = postData.imageUrl;
      }
      
      await post.save();

      return post;
    } catch (error) {
      console.log(error);
      if (error instanceof ApplicationError) {
        throw error;
      }

      throw new ApplicationError(
        "Something went wrong while updating the post...",
        500
      );
    }
  };
}

export default PostRepository;
