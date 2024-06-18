import jwt from "jsonwebtoken";
import { ApplicationError } from "../errorHandling/customErrorHandling.middleware.js";

export const auth = (req, res, next) => {
  try {
    const authHeaders = req.headers["authorization"];
    const token = authHeaders.split(" ")[1];

    console.log({ token });
    if (!token) {
      throw new ApplicationError("unauthorized(token not provided)", 400);
    }

    const isValid = jwt.verify(token, process.env.SECRET_KEY);
    req.userId = isValid.id;

    if (!isValid) {
      throw new ApplicationError("unauthorized", 403);
    }

    next();
  } catch (error) {
    console.log(error);
  }
};
