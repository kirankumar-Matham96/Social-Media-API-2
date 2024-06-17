export const auth = (req, res, next) => {
  console.log(req.cookies.token);

  next();
};
