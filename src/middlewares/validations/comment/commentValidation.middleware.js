class CommentValidationMiddleware {
  /**
   *  To validate input comment data
   * @param {request} req
   * @param {response} res
   * @param {next middleware callback} next
   * @returns Response Object | null
   */
  commentValidation = async (req, res, next) => {
    try {
      await body("content")
        .notEmpty()
        .withMessage("content is required")
        .run(req);

      const validationResults = validationResult(req);

      if (validationResults.array().length > 0) {
        return res
          .status(400)
          .json({ success: false, error: validationResults.array()[0].msg });
      }

      next();
    } catch (error) {
      console.log("validation error: ", { error });
      next(error);
    }
  };
}

export default CommentValidationMiddleware;
