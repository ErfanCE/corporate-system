const Employee = require('../models/employee-model');
const { AppError } = require('../utils/app-error');
const { ApiFeatures } = require('../utils/api-features');
const { getProvinces } = require('../utils/iran-provinces-data');

const getAllEmployees = async (req, res, next) => {
  try {
    const employeeModel = new ApiFeatures(Employee.find({}), req.query)
      .limitFields()
      .paginate()
      .filter()
      .sort();

    const employees = await employeeModel.model;

    res.status(200).json({ status: 'success', data: { employees } });
  } catch (err) {
    next(err);
  }
};

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
    next(err);
  }
};

const editEmployeeById = async (req, res, next) => {
  try {
    const { id: employeeId } = req.params;
    const {
      firstname,
      lastname,
      gender,
      dateOfBirth,
      nationalCode,
      province,
      role,
      phoneNumber
    } = req.body;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return next(new AppError(404, `employee: ${employeeId} not found`));
    }

    const duplicateNationalCode = await Employee.findOne({ nationalCode });
    if (
      !!duplicateNationalCode &&
      duplicateNationalCode.nationalCode !== employee.nationalCode
    ) {
      return next(
        new AppError(
          409,
          `national code: ${nationalCode} is already exist, choose a different national code`
        )
      );
    }

    // TODO: check phone number duplication

    // edit employee properties
    employee.firstname = firstname ?? employee.firstname;
    employee.lastname = lastname ?? employee.lastname;
    employee.gender = gender ?? employee.gender;
    employee.dateOfBirth = dateOfBirth ?? employee.dateOfBirth;
    employee.nationalCode = nationalCode ?? employee.nationalCode;
    employee.province = province ?? employee.province;
    employee.role = role ?? employee.role;
    employee.phoneNumber = phoneNumber ?? employee.phoneNumber;

    await employee.save();

    res.status(200).json({
      status: 'success',
      data: { employee }
    });
  } catch (err) {
    next(err);
  }
};

const deleteEmployeeById = async (req, res, next) => {
  try {
    const { id: employeeId } = req.params;

    const employee = await Employee.findByIdAndDelete(employeeId);
    if (!employee) {
      return next(new AppError(404, `employee: ${employeeId} not found`));
    }

    res.status(200).json({
      status: 'success',
      data: { employee }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllEmployees,
  addEmployee,
  validateProvince,
  editEmployeeById,
  deleteEmployeeById
};
