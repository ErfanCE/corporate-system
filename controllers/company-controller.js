const Company = require('../models/company-model');
const Employee = require('../models/employee-model');
const { AppError } = require('../utils/app-error');
const { ApiFeatures } = require('../utils/api-features');

const getAllCompanies = async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  const companyModel = new ApiFeatures(Company.find({}), req.query)
    .limitFields()
    .paginate()
    .filter()
    .sort();

  const companies = await companyModel.model;

  const totalModel = new ApiFeatures(Company.find({}), req.query).filter();
  const total = await totalModel.model;

  const totalPages = Math.ceil(total.length / Number(limit));

  res.status(200).json({
    status: 'success',
    total: total.length,
    totalPages,
    page: Number(page),
    perPage: Number(limit),
    data: { companies }
  });
};

const addCompany = async (req, res, next) => {
  const { registerationCode, phoneNumber } = req.body;

  const registerationCodeExists = await Company.exists({ registerationCode });
  if (!!registerationCodeExists) {
    return next(
      new AppError(
        409,
        `registeration code: ${registerationCode} is already exists`
      )
    );
  }

  const phoneNumberExists = await Company.exists({ phoneNumber });
  if (!!phoneNumberExists) {
    return next(
      new AppError(409, `phone number: ${phoneNumber} is already exists`)
    );
  }

  const company = await Company.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { company }
  });
};

const getCompanyById = async (req, res, next) => {
  const { id: companyId } = req.params;

  const company = await Company.findById(companyId);
  if (!company) {
    return next(new AppError(404, `company: ${companyId} not found`));
  }

  res.status(200).json({
    status: 'success',
    data: { company }
  });
};

const editCompanyById = async (req, res, next) => {
  const { id: companyId } = req.params;
  const { name, registerationCode, province, phoneNumber } = req.body;

  const company = await Company.findById(companyId);
  if (!company) {
    return next(new AppError(404, `company: ${companyId} not found`));
  }

  const duplicateRegisterationCode = await Company.findOne({
    registerationCode,
    _id: { $ne: company._id }
  });
  if (!!duplicateRegisterationCode) {
    return next(
      new AppError(
        409,
        `registeration code: ${registerationCode} is already exist, use a different registeration code`
      )
    );
  }

  const duplicatePhoneNumber = await Company.findOne({
    phoneNumber,
    _id: { $ne: company._id }
  });
  if (!!duplicatePhoneNumber) {
    return next(
      new AppError(
        409,
        `phone number: ${phoneNumber} is already exist, use a different phone number`
      )
    );
  }

  company.name = name ?? company.name;
  company.registerationCode = registerationCode ?? company.registerationCode;
  company.province = province ?? company.province;
  company.phoneNumber = phoneNumber ?? company.phoneNumber;

  await company.save();

  res.status(200).json({
    status: 'success',
    data: { company }
  });
};

const deleteCompanyById = async (req, res, next) => {
  const { id: companyId } = req.params;

  const company = await Company.findByIdAndDelete(companyId);
  if (!company) {
    return next(new AppError(404, `company: ${companyId} not found`));
  }

  // remove linked employees
  await Employee.deleteMany({ company: companyId });

  res.status(200).json({
    status: 'success',
    data: { company }
  });
};

module.exports = {
  addCompany,
  getAllCompanies,
  getCompanyById,
  editCompanyById,
  deleteCompanyById
};
