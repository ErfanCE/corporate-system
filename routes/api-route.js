const router = require('express').Router();
const employeeRouter = require('./employee-route');

router.use('/employees', employeeRouter);

module.exports = router;
