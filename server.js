import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/users", userRouter);
// app.use("/api/posts", postsRouter);
// app.use("/api/comments", commentsRouter);
// app.use("/api/likes", likesRouter);
// app.use("/api/friends", friendshipRouter);
// app.use("/api/otp", otpRouter);

app.listen(PORT, () => {
  console.log(`server is running at ${PORT}`);
});
