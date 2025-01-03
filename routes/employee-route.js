const router = require('express').Router();
const {
  addEmployee,
  validateProvince,
  getAllEmployees,
  editEmployeeById,
  deleteEmployeeById
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

// TODO: add param middleware

router.patch(
  '/:id',
  validator(editEmployeeValidationSchema),
  validateProvince,
  editEmployeeById
);

router.delete('/:id', deleteEmployeeById);

module.exports = router;
