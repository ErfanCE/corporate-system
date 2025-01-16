const router = require('express').Router();
const { asyncHandler } = require('../utils/async-handler');
const {
  addCompany,
  getAllCompanies,
  getCompanyById,
  editCompanyById,
  deleteCompanyById
} = require('../controllers/company-controller');
const { validateEntityId } = require('../validation/entity-id-validation');
const {
  addCompanyValidationSchema,
  editCompanyValidationSchema
} = require('../validation/company-validation');
const { validator } = require('../validation/validator');
const { validateProvince } = require('../validation/province-validation');

router.get('/', asyncHandler(getAllCompanies));

router.post(
  '/',
  validator(addCompanyValidationSchema),
  asyncHandler(validateProvince),
  asyncHandler(addCompany)
);

router.param('id', validateEntityId);

router.get('/:id', asyncHandler(getCompanyById));

router.patch(
  '/:id',
  validator(editCompanyValidationSchema),
  asyncHandler(validateProvince),
  asyncHandler(editCompanyById)
);

router.delete('/:id', asyncHandler(deleteCompanyById));

module.exports = router;
