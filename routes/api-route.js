const router = require('express').Router();
const companyRouter = require('./company-route');
const employeeRouter = require('./employee-route');

router.use('/companies', companyRouter);
router.use('/employees', employeeRouter);

module.exports = router;
