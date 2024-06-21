// package imports
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// module imports
import { ApplicationError } from "../errorHandling/customErrorHandling.middleware.js";
import { tokenBlockListSchema } from "../../features/user/schemas/tokenBlocklist.schema.js";
import { userSchema } from "../../features/user/schemas/user.schema.js";

/**
 * Checks if the token block listed or not
 * @param {JWT from the request} token 
 * @returns boolean
 */
const isTokenBlockListed = async (token) => {
  const TokenModel = new mongoose.model(
    "BlocklistTokens",
    tokenBlockListSchema
  );
  const isBlocked = await TokenModel.findOne({ token });
  if (isBlocked) {
    return true;
  }
  return false;
};

/**
 * Authenticates user and authorizes various operations
 * @param {request} req 
 * @param {response} res 
 * @param {next middleware callback} next 
 */
export const auth = async (req, res, next) => {
  try {
    // user model initialization
    const UserModel = new mongoose.model("Users", userSchema);

    // getting token from bearer token
    const authHeaders = req.headers["authorization"];
    const token = authHeaders.split(" ")[1];

    // checking if token provided
    if (!token) {
      throw new ApplicationError("unauthorized(token not provided)", 400);
    }

    // checking if the token valid
    const isValid = jwt.verify(token, process.env.SECRET_KEY);

    // checking if the token block listed
    const isBlockListed = await isTokenBlockListed(token);

    // if token is not valid or block listed
    if (!isValid || isBlockListed) {
      throw new ApplicationError("unauthorized", 401);
    }

    // getting the user
    const user = UserModel.findById(isValid.id);

    // checking if token version matches
    if (!user || user.tokenVersion !== isValid.version) {
      throw new ApplicationError("invalid token", 401);
    }

    // setting user id to the request
    req.userId = isValid.id;

    next();
  } catch (error) {
    console.log(error);
  }
};
