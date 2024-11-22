const { Schema, model } = require('mongoose');
const { getProvinces } = require('../utils/iran-provinces-data');
const { isDate, isNumeric, isMobilePhone } = require('validator');

const EmployeeSchema = new Schema(
  {
    firstname: {
      type: String,
      required: [true, 'firstname is required.'],
      minlength: [3, 'firstname must be equal or more than 3 characters'],
      maxlength: [30, 'firstname must be equal or less than 30 characters'],
      trim: true
    },
    lastname: {
      type: String,
      required: [true, 'lastname is required.'],
      minlength: [3, 'lastname must be equal or more than 3 characters'],
      maxlength: [30, 'lastname must be equal or less than 30 characters'],
      trim: true
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'not-set'],
        message: 'invalid gender ({VALUE}): gender is eather male or female'
      },
      default: 'not-set',
      trim: true,
      lowercase: true
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'date of birth is required'],
      validate: {
        validator: (value) => {
          return isDate(value, {
            format: 'YYYY/MM/DD',
            strictMode: true,
            delimiters: ['-']
          });
        },
        message: 'provide valid date of birth'
      }
    },
    nationalCode: {
      type: String,
      unique: true,
      required: [true, 'national code is required'],
      minlength: [10, 'national code length must be 10 characters'],
      maxlength: [10, 'national code length must be 10 characters'],
      validate: {
        validator: (value) => isNumeric(value),
        message: 'national code must be contain numbers only'
      },
      trim: true
    },
    province: {
      type: String,
      default: 'not-set',
      trim: true,
      lowercase: true,
      validate: async (value) => {
        try {
          const provinces = await getProvinces();
          return provinces.includes(value);
        } catch (err) {
          throw err;
        }
      },
      message: 'provide valid province'
    },
    company: {
      type: String,
      required: [true, 'company is required.'],
      minlength: [2, 'company must be equal or more than 3 characters'],
      maxlength: [40, 'company must be equal or less than 30 characters'],
      trim: true
    },
    role: {
      type: String,
      enum: {
        values: ['manager', 'employee'],
        message: 'inavlid role ({VALUE}): role is eather manager or employee'
      },
      default: 'employee',
      trim: true,
      lowercase: true
    },
    phoneNumber: {
      type: [String],
      unique: true,
      required: [true, 'phone number is required'],
      validate: {
        validator: (value) => {
          if (value.length) return false;

          return value.every((phone) => isMobilePhone(phone, 'fa-IR'));
        },
        message: 'provide valid phone number and at least one phone number'
      },
      set: (value) => {
        const normalizedPhoneNumbers = value.map((phone) => {
          if (phone.startsWith('0')) return `+98${phone.slice(1)}`;
          return phone;
        });

        return normalizedPhoneNumbers;
      }
    }
  },
  { timestamps: true }
);

module.exports = model('Employee', EmployeeSchema);
