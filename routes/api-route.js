const router = require('express').Router();
const companyRouter = require('./company-route');
const employeeRouter = require('./employee-route');

const Employee = require('../models/employee-model');
const Company = require('../models/company-model');

router.use('/companies', companyRouter);
router.use('/employees', employeeRouter);

module.exports = router;
