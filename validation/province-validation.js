const { getProvinces } = require('../utils/iran-provinces-data');
const { AppError } = require('../utils/app-error');

const validateProvince = async (req, res, next) => {
  const { province = 'not-set' } = req.body;

  if (province === 'not-set') return next();

  const provinces = await getProvinces();
  if (!provinces.includes(province)) {
    return next(new AppError(400, 'provide valid province :)'));
  }

  next();
};

module.exports = { validateProvince };
