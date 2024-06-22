// module imports
import PostRepository from "../repositories/post.repository.js";

/**
 * Controller class to handle all requests related to posts.
 */
class PostController {
  constructor() {
    this.postRepository = new PostRepository();
  }

  /**
   * To create a new post
   * @param {request} req
   * @param {response} res
   * @param {next middleware callback} next
   */
  createPost = async (req, res, next) => {
    try {
      const { userId } = req;
      req.body.imageUrl = req.file.filename;
      const newPost = await this.postRepository.create(req.body, userId);

      res
        .status(201)
        .json({ success: true, message: "post added successfully", newPost });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  /**
   * To get all posts
   * @param {request} req
   * @param {response} res
   * @param {next middleware callback} next
   */
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

  /**
   * To get all posts related to current user
   * @param {request} req
   * @param {response} res
   * @param {next middleware callback} next
   */
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

  /**
   * To get post by id
   * @param {request} req
   * @param {response} res
   * @param {next middleware callback} next
   */
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

  /**
   * To update post by id
   * @param {request} req
   * @param {response} res
   * @param {next middleware callback} next
   */
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

  /**
   * To delete post by id
   * @param {request} req
   * @param {response} res
   * @param {next middleware callback} next
   */
  deletePostById = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { userId } = req;
      const { message } = await this.postRepository.delete(userId, postId);
      res.status(200).json({ success: true, message: message });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

export default PostController;
