class ApiError extends Error {
  constructor(message, status, errors = [], stack = "") {
    super(message);
    this.status = status;
    this.message = message;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
