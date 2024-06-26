// package imports
import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";

// module imports
import { connectToDb } from "./src/config/mongoose.config.js";
import { auth } from "./src/middlewares/authorization/auth.middleware.js";
import { errorHandlingMiddleware } from "./src/middlewares/errorHandling/customErrorHandling.middleware.js";
import userRouter from "./src/features/user/routes/user.routes.js";
import postsRouter from "./src/features/posts/routes/post.routes.js";
import commentsRouter from "./src/features/comments/routes/comment.routes.js";
import likesRouter from "./src/features/likes/routes/like.routes.js";
import friendshipRouter from "./src/features/friendships/routes/friendship.routes.js";
import otpRouter from "./src/features/OTP/routes/otp.routes.js";
import unknownPathHandlerMiddleware from "./src/middlewares/404Handler/unknownPathHandler.middleware.js";

// initializing express
const app = express();

// setting the port number
const PORT = process.env.PORT || 3000;

// setting up data parsers to read data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// setting cookie parser middleware to app level
app.use(cookieParser());

// routes
app.use("/api/users", userRouter);
app.use("/api/posts", auth, postsRouter);
app.use("/api/comments", auth, commentsRouter);
app.use("/api/likes", auth, likesRouter);
app.use("/api/friends", auth, friendshipRouter);
app.use("/api/otp", auth, otpRouter);

// 404 errors handling
app.use(unknownPathHandlerMiddleware);

// application level error handling
app.use(errorHandlingMiddleware);

// setting the listener
app.listen(PORT, () => {
  // connecting to the database
  connectToDb();
  console.log(`server is running at ${PORT}`);
});
