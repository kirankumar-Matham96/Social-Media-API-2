// package imports
import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";

// module imports
import { connectToDb } from "./src/config/mongoose.config.js";
import userRouter from "./src/features/user/routes/user.routes.js";
import { errorHandlingMiddleware } from "./src/middlewares/errorHandling/customErrorHandling.middleware.js";
import { auth } from "./src/middlewares/authorization/auth.middleware.js";

// initializing express
const app = express();

// setting the port number
const PORT = process.env.PORT || 8000;

// setting up data parsers to read data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// setting cookie parser middleware to app level
app.use(cookieParser());

// routes
app.use("/api/users", userRouter);
// app.use("/api/posts", postsRouter);
// app.use("/api/comments", commentsRouter);
// app.use("/api/likes", likesRouter);
// app.use("/api/friends", friendshipRouter);
// app.use("/api/otp", otpRouter);

// application level error handling
app.use(errorHandlingMiddleware);

// 404 errors
// app.user()

// setting the listener
app.listen(PORT, () => {
  // connecting to the database
  connectToDb();
  console.log(`server is running at ${PORT}`);
});
