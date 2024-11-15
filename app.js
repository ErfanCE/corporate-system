const express = require('express');
const morgan = require('morgan');
const { AppError } = require('./utils/app-error');

const app = express();
const port = 8000;
const host = '127.0.0.1';

// Logger
app.use(morgan('dev'));

// Body Parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Unhandled Routes
app.all('*', (request, response, next) => {
  const { method, originalUrl } = request;
  next(new AppError(404, `can't find ${method} ${originalUrl}`));
});

// Global Error Handler
app.use((err, request, response, next) => {
  const {
    statusCode = 500,
    status = 'error',
    message = 'internal server error'
  } = err;

  response.status(statusCode).json({ status, message });
});

app.listen(port, host, () => {
  console.info(`[i] Listening on ${host}:${port} ...`);
});
