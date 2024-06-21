// module imports
import { ApplicationError } from "../errorHandling/customErrorHandling.middleware.js";

/**
 * To handle incorrect request paths
 * @param {request} req
 * @param {response} res
 * @param {next middleware callback} next
 */
const unknownPathHandlerMiddleware = (req, res, next) => {
  throw new ApplicationError(
    "404 request path not found, please check the request and method",
    404
  );
};

export default unknownPathHandlerMiddleware;
