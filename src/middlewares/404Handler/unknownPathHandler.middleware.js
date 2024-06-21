import { ApplicationError } from "../errorHandling/customErrorHandling.middleware.js";

const unknownPathHandlerMiddleware = (req, res, next) => {
  throw new ApplicationError(
    "404 request path not found, please check the request and method",
    404
  );
};

export default unknownPathHandlerMiddleware;
