const router = require('express').Router();
const {
  addEmployee,
  validateProvince,
  getAllEmployees,
  editEmployeeById
} = require('../controllers/employee-controller');
const { validator } = require('../validation/validator');
const {
  addEmployeeValidationSchema,
  editEmployeeValidationSchema
} = require('../validation/employee-validation');

router.get('/', getAllEmployees);

router.post(
  '/',
  validator(addEmployeeValidationSchema),
  validateProvince,
  addEmployee
);

router.patch(
  '/:id',
  validator(editEmployeeValidationSchema),
  validateProvince,
  editEmployeeById
);

module.exports = router;
