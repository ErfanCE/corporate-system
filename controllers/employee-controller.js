const Employee = require('../models/employee-model');
const ObjectId = require('mongoose').Types.ObjectId;
const { AppError } = require('../utils/app-error');
const { ApiFeatures } = require('../utils/api-features');
const { getProvinces } = require('../utils/iran-provinces-data');

const validateProvince = async (req, res, next) => {
  const { province = 'not-set' } = req.body;

  if (province === 'not-set') return next();

  const provinces = await getProvinces();
  if (!provinces.includes(province)) {
    return next(new AppError(400, 'provide valid province :)'));
  }

  next();
};

const validateEmployeeId = (req, res, next, id) => {
  const err = new AppError(400, `invalid employee id: ${id}`);

  if (!ObjectId.isValid(id)) return next(err);
  if (new ObjectId(id).toString() !== id) return next(err);

  next();
};

const getAllEmployees = async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  const employeeModel = new ApiFeatures(Employee.find({}), req.query)
    .limitFields()
    .paginate()
    .filter()
    .sort();

  const employees = await employeeModel.model;

  const totalModel = new ApiFeatures(Employee.find({}), req.query).filter();
  const total = await totalModel.model;

  const totalPages = Math.ceil(total.length / Number(limit));

  res.status(200).json({
    status: 'success',
    total: total.length,
    totalPages,
    page: Number(page),
    perPage: Number(limit),
    data: { employees }
  });
};

// TODO: refactor duplication validations
const addEmployee = async (req, res, next) => {
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
};

const getEmployeeById = async (req, res, next) => {
  const { id: employeeId } = req.params;

  const employee = await Employee.findById(employeeId);
  if (!employee) {
    return next(new AppError(404, `employee: ${employeeId} not found`));
  }

  res.status(200).json({
    status: 'success',
    data: { employee }
  });
};

const editEmployeeById = async (req, res, next) => {
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

  // national code duplication validation
  const duplicateNationalCode = await Employee.findOne({
    nationalCode,
    _id: { $ne: employee._id }
  });
  if (!!duplicateNationalCode) {
    return next(
      new AppError(
        409,
        `national code: ${nationalCode} is already exist, use a different national code`
      )
    );
  }

  // national code duplication validation
  for (const phone of phoneNumber) {
    const duplicatePhoneNumber = await Employee.findOne({
      phoneNumber: phone,
      _id: { $ne: employee._id }
    });

    if (!!duplicatePhoneNumber) {
      return next(
        new AppError(
          409,
          `phone number: ${phone} is already exist, use a different phone number`
        )
      );
    }
  }

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
};

const deleteEmployeeById = async (req, res, next) => {
  const { id: employeeId } = req.params;

  const employee = await Employee.findByIdAndDelete(employeeId);
  if (!employee) {
    return next(new AppError(404, `employee: ${employeeId} not found`));
  }

  res.status(200).json({
    status: 'success',
    data: { employee }
  });
};

module.exports = {
  validateProvince,
  validateEmployeeId,
  getAllEmployees,
  addEmployee,
  getEmployeeById,
  editEmployeeById,
  deleteEmployeeById
};
