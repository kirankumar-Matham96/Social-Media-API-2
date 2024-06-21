// module imports
import { ApplicationError } from "../../../middlewares/errorHandling/customErrorHandling.middleware.js";
import LikeRepository from "../repositories/like.repository.js";

class LikeController {
  constructor() {
    this.likeRepository = new LikeRepository();
  }

  getLikes = async (req, res, next) => {
    try {
      const { id } = req.params;
      // const { type } = req.query;

      // if (type != "Post" && type != "Comment") {
      //   throw new ApplicationError(
      //     `Type should be either Post or Comment, found ${type}`,
      //     400
      //   );
      // }

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

  toggleLike = async (req, res, next) => {
    try {
      const {userId} = req;
      const { id } = req.params;
      const { type } = req.query;

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
