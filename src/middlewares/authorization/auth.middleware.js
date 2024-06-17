import jwt from "jsonwebtoken";
import { ApplicationError } from "../errorHandling/customErrorHandling.middleware.js";

export const auth = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    throw new ApplicationError("unauthorized(token not provided)", 400);
  }
  
  const isValid = jwt.verify(token, process.env.SECRET_KEY);
  req.userId = isValid._id;

  if (!isValid) {
    throw new ApplicationError("unauthorized", 403);
  }

  next();
};
