const router = require('express').Router();
const {
  setManagerRole,
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  editEmployeeById,
  deleteEmployeeById
} = require('../controllers/employee-controller');
const { asyncHandler } = require('../utils/async-handler');
const { validator } = require('../validation/validator');
const {
  addEmployeeValidationSchema,
  editEmployeeValidationSchema
} = require('../validation/employee-validation');
const { validateEntityId } = require('../validation/entity-id-validation');
const { validateProvince } = require('../validation/province-validation');

router.get('/', asyncHandler(getAllEmployees));

router.post(
  '/',
  validator(addEmployeeValidationSchema),
  asyncHandler(validateProvince),
  asyncHandler(addEmployee)
);

router.post(
  '/manager',
  validator(addEmployeeValidationSchema),
  asyncHandler(validateProvince),
  setManagerRole,
  asyncHandler(addEmployee)
);

router.param('id', validateEntityId);

router.get('/:id', asyncHandler(getEmployeeById));

router.patch(
  '/:id',
  validator(editEmployeeValidationSchema),
  asyncHandler(validateProvince),
  asyncHandler(editEmployeeById)
);

router.delete('/:id', asyncHandler(deleteEmployeeById));

module.exports = router;
