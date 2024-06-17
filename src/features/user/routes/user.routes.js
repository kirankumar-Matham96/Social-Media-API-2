import express from "express";

import UserController from "../controllers/user.controller.js";
const router = express.Router();

const userController = new UserController();

router.post("/signup", (req, res, next) =>
  userController.registerUser(req, res, next)
);
router.post("/signin", (req, res, next) =>
  userController.loginUser(req, res, next)
);
router.get("/logout", (req, res, next) =>
  userController.logoutUser(req, res, next)
);
router.get("/logout-all-devices", (req, res, next) =>
  userController.logoutUserFromAllDevices(req, res, next)
);
router.get("/get-details/:id", (req, res, next) =>
  userController.getUserDetails(req, res, next)
);
router.get("/get-all-details", (req, res, next) =>
  userController.getAllUsersDetails(req, res, next)
);
router.get("/update-details/:id", (req, res, next) =>
  userController.UpdateUserDetails(req, res, next)
);

export default router;
