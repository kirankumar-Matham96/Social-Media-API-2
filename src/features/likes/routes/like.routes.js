// package imports
import express from "express";

// module imports
import LikeController from "../controllers/like.controller.js";

const router = express.Router();
const likeController = new LikeController();

router.get("/:id", (req, res, next) => likeController.getLikes(req, res, next));
router.get("/toggle/:id", (req, res, next) =>
  likeController.toggleLike(req, res, next)
);

export default router;
