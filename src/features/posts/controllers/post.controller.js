// module imports
import PostRepository from "../repositories/post.repository.js";

class PostController {
  constructor() {
    this.postRepository = new PostRepository();
  }

  createPost = async (req, res, next) => {
    try {
      const { userId } = req;
      req.body.imageUrl = req.file.filename;
      const newPost = await this.postRepository.create(req.body, userId);
      newPost.imageUrl = req.file;

      res
        .status(201)
        .json({ success: true, message: "post added successfully", newPost });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getAllPosts = async (req, res, next) => {
    try {
      const posts = await this.postRepository.getAllPosts();

      res
        .status(200)
        .json({ success: true, message: "retrieved all the posts", posts });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getAllUserPosts = async (req, res, next) => {
    try {
      const { userId } = req;
      const posts = await this.postRepository.getUserPosts(userId);

      res.status(200).json({
        success: true,
        message: "retrieved all the user posts",
        posts,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getPostById = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const post = await this.postRepository.get(postId);
      res
        .status(200)
        .json({ success: true, message: "post retrieved successfully", post });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  updatePostById = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { userId } = req;
      req.body.imageUrl = req.file.filename;
      const post = await this.postRepository.update(userId, postId, req.body);
      res
        .status(200)
        .json({ success: true, message: "post updated successfully", post });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  deletePostById = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { userId } = req;
      const post = await this.postRepository.delete(userId, postId);
      res
        .status(200)
        .json({ success: true, message: "post deleted successfully" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

export default PostController;
