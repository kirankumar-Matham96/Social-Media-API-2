// package imports
import mongoose from "mongoose";

// module imports
import { postsSchema } from "../schemas/post.schema.js";
import { ApplicationError } from "../../../middlewares/errorHandling/customErrorHandling.middleware.js";

const PostModel = new mongoose.model("Posts", postsSchema);

class PostRepository {
  getAllPosts = async () => {
    try {
      const posts = await PostModel.find().populate("userId");
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

  getUserPosts = async (userId) => {
    try {
      const posts = await PostModel.find({ userId }).populate("userId");
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

  get = async (postId) => {
    try {
      const post = await PostModel.findById(postId).populate("userId");
      const modifiedPosts = {
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

      return modifiedPosts;
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "Something went wrong while fetching the posts...",
        500
      );
    }
  };

  create = async (postDetails, userId) => {
    try {
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
      return post;
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

  update = async (userId, postId, postData) => {
    try {
      const post = await PostModel.findById(postId);
      // if the user tries to update other user's post
      const isUserValid = post.userId.toString() === userId;
      if (!isUserValid) {
        throw new ApplicationError("user not allowed to update this post", 403);
      }

      post.caption = postData.caption;
      post.content = postData.content;
      post.imageUrl = postData.imageUrl;
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
