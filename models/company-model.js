const { Schema, model } = require('mongoose');
const { getProvinces } = require('../utils/iran-provinces-data');
const { isNumeric, isMobilePhone } = require('validator');

const CompanySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required.'],
      minlength: [2, 'name must be equal or more than 2 characters'],
      maxlength: [30, 'name must be equal or less than 30 characters'],
      trim: true
    },
    registerationDate: {
      type: Date,
      default: Date.now,
      immutable: true
    },
    registerationCode: {
      type: String,
      unique: true,
      required: [true, 'registeration code is required'],
      minlength: [10, 'registeration code length must be 10 characters'],
      maxlength: [10, 'registeration code length must be 10 characters'],
      validate: {
        validator: (value) => isNumeric(value),
        message: 'registeration code must be contain numbers only'
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
          if (value === 'not-set') return true;

          const provinces = await getProvinces();
          return provinces.includes(value);
        } catch (err) {
          throw err;
        }
      },
      message: 'provide valid province'
    },
    phoneNumber: {
      type: String,
      unique: true,
      required: [true, 'phone number is required'],
      validate: {
        validator: (value) => isMobilePhone(value, 'fa-IR'),
        message: 'provide valid phone number'
      },
      set: (value) => {
        if (value.startsWith('0')) return `+98${value.slice(1)}`;

        return value;
      }
    }
  },
  { timestamps: true }
);

module.exports = model('Company', CompanySchema);
