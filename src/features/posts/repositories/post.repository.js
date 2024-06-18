// package imports
import mongoose from "mongoose";

// module imports
import { postsSchema } from "../schemas/post.schema.js";
import { ApplicationError } from "../../../middlewares/errorHandling/customErrorHandling.middleware.js";

const PostModel = new mongoose.model("Posts", postsSchema);

class PostRepository {
  getAllPosts = async () => {
    try {
      const posts = await PostModel.find();
      return posts;
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
      const posts = await PostModel.find({ userId });
      return posts;
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
      const post = await PostModel.findById(postId);
      return post;
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "Something went wrong while fetching the posts...",
        500
      );
    }
  };

  create = async (postDetails) => {
    try {
      const post = new PostModel(postDetails);
      return await post.save();
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "Something went wrong while creating the post...",
        500
      );
    }
  };

  delete = async (postId) => {
    try {
      const post = PostModel.deleteOne({ _id: postId });
      return post;
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "Something went wrong while deleting the post...",
        500
      );
    }
  };

  update = async (postId, postData) => {
    try {
      const post = PostModel.findById(postId);
      post.caption = postData.caption;
      post.content = postData.content;
      post.imageUrl = postData.imageUrl;
      await post.save();
      
      return post;
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "Something went wrong while deleting the post...",
        500
      );
    }
  };
}

export default PostRepository;
