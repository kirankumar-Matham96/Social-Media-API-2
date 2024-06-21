// package imports
import express from "express";

// module imports
import PostController from "../controllers/post.controller.js";
import { upload } from "../../../middlewares/uploadFileHandling/multer.middleware.js";
import PostValidationMiddleware from "../../../middlewares/validations/post/postValidation.middleware.js";

const postValidationMiddleware = new PostValidationMiddleware();

const router = express.Router();
const postController = new PostController();

router.post(
  "/",
  upload.single("imageUrl"),
  (req, res, next) => postValidationMiddleware.postValidation(req, res, next),
  (req, res, next) => postController.createPost(req, res, next)
);

router.get("/all", (req, res, next) =>
  postController.getAllPosts(req, res, next)
);

router.get("/:postId", (req, res, next) =>
  postController.getPostById(req, res, next)
);

router.get("/", (req, res, next) =>
  postController.getAllUserPosts(req, res, next)
);

router.delete("/:postId", (req, res, next) =>
  postController.deletePostById(req, res, next)
);

router.put("/:postId", upload.single("imageUrl"), (req, res, next) =>
  postController.updatePostById(req, res, next)
);

export default router;
