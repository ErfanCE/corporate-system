function AppError(statusCode, errorMessage) {
	this.message = errorMessage;
	this.statusCode = statusCode;
	this.status = statusCode.toString().startsWith('5') ? 'error' : 'fail';

	Error.captureStackTrace(this);
}

module.exports = { AppError };
