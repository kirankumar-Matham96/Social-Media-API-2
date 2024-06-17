// package imports
import "dotenv/config";
import express from "express";

// module imports
import { connectToDb } from "./src/config/mongoose.config.js";
import userRouter from "./src/features/user/routes/user.routes.js";

// initializing express
const app = express();

// setting the port number
const PORT = process.env.PORT;

// setting up data parsers to read data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/users", userRouter);
// app.use("/api/posts", postsRouter);
// app.use("/api/comments", commentsRouter);
// app.use("/api/likes", likesRouter);
// app.use("/api/friends", friendshipRouter);
// app.use("/api/otp", otpRouter);

// setting the listener
app.listen(PORT, () => {
  // connecting to the database
  connectToDb();
  console.log(`server is running at ${PORT}`);
});
