const Employee = require('../models/employee-model');
const { AppError } = require('../utils/app-error');
const { getProvinces } = require('../utils/iran-provinces-data');

// /post > validator(validationSchema) > validatePrvince > addEmployee

const validateProvince = async (req, res, next) => {
  try {
    const { province = 'not-set' } = req.body;

    if (province === 'not-set') return next();

    const provinces = await getProvinces();
    if (!provinces.includes(province)) {
      return next(new AppError(400, 'provide valid province :)'));
    }

    next();
  } catch (err) {
    next(err);
  }
};

// TODO: refactor duplication validations -
const addEmployee = async (req, res, next) => {
  try {
    const { nationalCode, phoneNumber } = req.body;

    // national code duplication validation
    const nationalCodeExists = await Employee.exists({ nationalCode });
    if (!!nationalCodeExists) {
      return next(
        new AppError(409, `national code: ${nationalCode} is already exists`)
      );
    }

    // phone number duplication validation
    for (let phone of phoneNumber) {
      if (phone.startsWith('0')) {
        phone = `+98${phone.slice(1)}`;
      }

      const phoneNumberExists = await Employee.exists({ phoneNumber: phone });
      if (!!phoneNumberExists) {
        return next(
          new AppError(409, `phone number: ${phone} is already exists`)
        );
      }
    }
    const employee = await Employee.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { employee }
    });
  } catch (err) {
    console.log(err);

    next(err);
  }
};

module.exports = { addEmployee, validateProvince };
