import { body, validationResult } from "express-validator";

class UserValidations {
  registrationValidation = async (req, res, next) => {
    try {
      await body("name")
        .notEmpty()
        .withMessage("name is required with at least 3 characters")
        .run(req);
      await body("email")
        .notEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("invalid email")
        .run(req);
      await body("password")
        .notEmpty()
        .withMessage("password is required")
        .run(req);
      await body("gender")
        .notEmpty()
        .withMessage("gender is required")
        .run(req);

      const validationResults = validationResult(req);

      if (validationResults.array().length > 0) {
        return res
          .status(400)
          .json({ success: false, error: validationResults.array()[0].msg });
      }

      next();
    } catch (error) {
      console.log("validation error: ", { error });
      next(error);
    }
  };

  loginValidation = async (req, res, next) => {
    try {
      await body("email")
        .notEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("invalid email")
        .run(req);
      await body("password")
        .notEmpty()
        .withMessage("password is required")
        .run(req);

      const validationResults = validationResult(req);

      if (validationResults.array().length > 0) {
        return res
          .status(400)
          .json({ success: false, error: validationResults.array()[0].msg });
      }

      next();
    } catch (error) {
      console.log("validation error: ", { error });
      next(error);
    }
  };
}

export default UserValidations;
