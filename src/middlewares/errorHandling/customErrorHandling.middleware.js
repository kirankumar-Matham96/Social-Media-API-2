// package imports
import mongoose from "mongoose";

/**
 * Custom class to handle errors
 */
export class ApplicationError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * Catches any error in the upper levels of the application
 * @param {error} err
 * @param {request} req
 * @param {response} res
 * @param {next middleware callback} next
 * @returns string | null
 */
export const errorHandlingMiddleware = (err, req, res, next) => {
  if (err) {
    if (err instanceof ApplicationError) {
      console.log("Got instanceof ApplicationError");
      return res
        .status(err.statusCode)
        .json({ success: false, error: err.message });
    }

    if (err instanceof mongoose.Error.ValidationError) {
      console.log("Got instanceof mongoose.Error.ValidatorError");
      return res.status(400).json({ success: false, error: err.message });
    }

    console.log("error in handler => ", err);

    return res.status(500).json({
      success: false,
      error: "Something went wrong... Please try again later!",
    });
  }

  next();
};
