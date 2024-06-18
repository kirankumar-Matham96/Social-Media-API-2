// package imports
import mongoose from "mongoose";

// module imports
import { likeSchema } from "../schemas/like.schema.js";
import { ApplicationError } from "../../../middlewares/errorHandling/customErrorHandling.middleware.js";

const LikeModel = new mongoose.model("Comments", likeSchema);

class LikeRepository {
  toggle = async (id, type) => {
    try {
      const like = await LikeModel.findOne({ likable: id });

      if (!like) {
        const newLike = new LikeModel({ likable: id, on_model: type });
        await newLike.save();
        return { message: "liked", newLike };
      }
      await LikeModel.delete({ likable: id });

      return { message: "disliked" };
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "Something went wrong while fetching the comments...",
        500
      );
    }
  };

  get = async (id, type) => {
    try {
      const likes = await LikeModel.find({ likable: id });
      return likes;
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
