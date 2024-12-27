const router = require('express').Router();
const {
  addEmployee,
  validateProvince
} = require('../controllers/employee-controller');
const { validator } = require('../validation/validator');
const {
  addEmployeeValidationSchema
} = require('../validation/employee-validation');

router.post(
  '/',
  validator(addEmployeeValidationSchema),
  validateProvince,
  addEmployee
);

module.exports = router;
