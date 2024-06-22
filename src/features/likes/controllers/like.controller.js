// module imports
import { ApplicationError } from "../../../middlewares/errorHandling/customErrorHandling.middleware.js";
import LikeRepository from "../repositories/like.repository.js";

/**
 * Controller class to handle all requests related to likes of posts/comments.
 */
class LikeController {
  constructor() {
    this.likeRepository = new LikeRepository();
  }

  /**
   * To get all likes of a post or comment by it's id
   * @param {request} req
   * @param {response} res
   * @param {next middleware callback} next
   */
  getLikes = async (req, res, next) => {
    try {
      const { id } = req.params;
      const likes = await this.likeRepository.get(id);

      res.status(200).json({
        success: true,
        message: "likes retrieved successfully",
        likes,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  /**
   * To toggle like of a comment or post
   * @param {request} req
   * @param {response} res
   * @param {next middleware callback} next
   */
  toggleLike = async (req, res, next) => {
    try {
      const {userId} = req;
      const { id } = req.params;
      const { type } = req.query;

      // validating the type of entity to toggle like
      if (type != "Post" && type != "Comment") {
        throw new ApplicationError(
          `Type should be either Post or Comment, found ${type}`,
          400
        );
      }

      const { message } = await this.likeRepository.toggle(userId, id, type);

      res.status(200).json({
        success: true,
        message: `${message} successfully`,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

export default LikeController;
