// Third Party Modules
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

// Local Modules
const { AppError } = require('./utils/app-error');
const appRouter = require('./routes/app-route');

const app = express();
const port = 8000;
const host = '127.0.0.1';

mongoose
  .connect('mongodb://localhost:27017/corporate')
  .then(() => {
    console.log('[+] database connected successfully.');
  })
  .catch((err) => {
    console.error('[-] database connection error:', err.message);
    process.exit(1);
  });

// Logger
app.use(morgan('dev'));

// Body Parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Routing
app.use('/', appRouter);

// Not Found Routes
app.all('*', (req, res, next) => {
  next(new AppError(404, `can't find ${req.method} ${req.originalUrl}`));
});

// Global Error Handler
app.use((err, req, res, next) => {
  const {
    statusCode = 500,
    status = 'error',
    message = 'internal sever error, not your fault :)'
  } = err;

  res.status(statusCode).json({ status, message });
});

app.listen(port, host, () => {
  console.info(`[i] server is running on ${host}:${port} ...`);
});
