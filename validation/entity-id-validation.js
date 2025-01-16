const ObjectId = require('mongoose').Types.ObjectId;
const { AppError } = require('../utils/app-error');

const validateEntityId = (req, res, next, id) => {
  const err = new AppError(400, `invalid employee id: ${id}`);

  if (!ObjectId.isValid(id)) return next(err);
  if (new ObjectId(id).toString() !== id) return next(err);

  next();
};

module.exports = { validateEntityId };
