const router = require('express').Router();
const {
  addEmployee,
  validateProvince,
  getAllEmployees,
  editEmployeeById,
  deleteEmployeeById,
  getEmployeeById,
  validateEmployeeId
} = require('../controllers/employee-controller');
const { validator } = require('../validation/validator');
const {
  addEmployeeValidationSchema,
  editEmployeeValidationSchema
} = require('../validation/employee-validation');
const { asyncHandler } = require('../utils/async-handler');

router.get('/', asyncHandler(getAllEmployees));

router.post(
  '/',
  validator(addEmployeeValidationSchema),
  asyncHandler(validateProvince),
  asyncHandler(addEmployee)
);

router.param('id', validateEmployeeId);

router.get('/:id', asyncHandler(getEmployeeById));

router.patch(
  '/:id',
  validator(editEmployeeValidationSchema),
  validateProvince,
  asyncHandler(editEmployeeById)
);

router.delete('/:id', asyncHandler(deleteEmployeeById));

module.exports = router;
