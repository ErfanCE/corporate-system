const router = require('express').Router();
const apiRouter = require('./api-route');

router.use('/api', apiRouter);

module.exports = router;
