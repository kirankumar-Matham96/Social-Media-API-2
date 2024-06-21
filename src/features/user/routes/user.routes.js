// package imports
import express from "express";

// module imports
import UserValidations from "../../../middlewares/validations/user/registration.middleware.js";
import UserController from "../controllers/user.controller.js";
import { auth } from "../../../middlewares/authorization/auth.middleware.js";
const router = express.Router();

const userController = new UserController();
const userValidations = new UserValidations();

router.post(
  "/signup",
  (req, res, next) => userValidations.registrationValidation(req, res, next),
  (req, res, next) => userController.registerUser(req, res, next)
);

router.post(
  "/signin",
  (req, res, next) => userValidations.loginValidation(req, res, next),
  (req, res, next) => userController.loginUser(req, res, next)
);
router.get("/logout", (req, res, next) =>
  userController.logoutUser(req, res, next)
);
router.get(
  "/logout-all-devices",
  (req, res, next) => auth(req, res, next),
  (req, res, next) => userController.logoutUserFromAllDevices(req, res, next)
);
router.get(
  "/get-details/:id",
  (req, res, next) => auth(req, res, next),
  (req, res, next) => userController.getUserDetails(req, res, next)
);
router.get(
  "/get-all-details",
  (req, res, next) => auth(req, res, next),
  (req, res, next) => userController.getAllUsersDetails(req, res, next)
);
router.put(
  "/update-details/:id",
  (req, res, next) => auth(req, res, next),
  (req, res, next) => userController.UpdateUserDetails(req, res, next)
);

export default router;
