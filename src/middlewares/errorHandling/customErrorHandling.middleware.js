import mongoose from "mongoose";
import { application } from "express";

export class ApplicationError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandlingMiddleware = (err, req, res, next) => {
  if (err) {
    if (err instanceof ApplicationError) {
      return res
        .status(err.statusCode)
        .json({ success: false, error: err.message });
    }

    if (err instanceof mongoose.Error.ValidatorError) {
      return res.status(400).json({ success: false, error: err.message });
    }

    return res.status(500).json({
      success: false,
      error: "Something went wrong... Please try again later!",
    });
  }

  next();
};
