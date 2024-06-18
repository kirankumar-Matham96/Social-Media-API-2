// module imports
import FriendshipRepository from "../repositories/friendship.repository.js";

class FriendshipController {
  constructor() {
    this.friendshipRepository = new FriendshipRepository();
  }

  createPost = async (req, res, next) => {
    try {
      const newPost = await this.friendshipRepository.create(req.body);

      res
        .status(201)
        .json({ success: true, message: "post added successfully", newPost });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

export default FriendshipController;
