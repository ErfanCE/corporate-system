const Joi = require('joi');

const numericStringRegex = /^\d+$/;
const iranPhoneNumberRegex = /^(\+98|0)?9\d{9}$/;

const addCompanyValidationSchema = Joi.object({
  name: Joi.string().min(2).max(40).trim().required(),
  registerationCode: Joi.string()
    .length(10)
    .pattern(numericStringRegex)
    .trim()
    .required(),
  province: Joi.string().lowercase().trim(),
  phoneNumber: Joi.string().pattern(iranPhoneNumberRegex).required()
});

const editCompanyValidationSchema = Joi.object({
  name: Joi.string().min(2).max(40).trim(),
  registerationCode: Joi.string().length(10).pattern(numericStringRegex).trim(),
  province: Joi.string().lowercase().trim(),
  phoneNumber: Joi.string().pattern(iranPhoneNumberRegex)
});

module.exports = { addCompanyValidationSchema, editCompanyValidationSchema };
