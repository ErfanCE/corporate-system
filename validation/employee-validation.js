const Joi = require('joi');

const numericStringRegex = /^\d+$/;
const iranPhoneNumberRegex = /^(\+98|0)?9\d{9}$/;

const addEmployeeValidationSchema = Joi.object({
  firstname: Joi.string().min(3).max(40).trim().required(),
  lastname: Joi.string().min(3).max(40).trim().required(),
  dateOfBirth: Joi.date().iso().required(),
  nationalCode: Joi.string()
    .length(10)
    .pattern(numericStringRegex)
    .trim()
    .required(),
  province: Joi.string().lowercase().trim(),
  phoneNumber: Joi.array()
    .min(1)
    .items(Joi.string().pattern(iranPhoneNumberRegex))
    .required(),
  gender: Joi.string().valid('male', 'female', 'not-set').lowercase().trim()
});

const editEmployeeValidationSchema = Joi.object({
  firstname: Joi.string().min(3).max(40).trim(),
  lastname: Joi.string().min(3).max(40).trim(),
  dateOfBirth: Joi.date().iso(),
  nationalCode: Joi.string().length(10).pattern(numericStringRegex).trim(),
  province: Joi.string().lowercase().trim(),
  phoneNumber: Joi.array()
    .min(1)
    .items(Joi.string().pattern(iranPhoneNumberRegex)),
  gender: Joi.string().valid('male', 'female', 'not-set').lowercase().trim()
});

module.exports = { addEmployeeValidationSchema, editEmployeeValidationSchema };
