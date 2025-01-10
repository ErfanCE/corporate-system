const asyncHandler = (asyncFn) => (req, res, next) => {
  asyncHandler(req, res, next).catch(next);
};

module.exports = { asyncHandler };
