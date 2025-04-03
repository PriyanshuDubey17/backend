class apiError extends Error {
  constructor(message, statusCode) {
    console.log(message,statusCode, "600000000")
    super(message);
    this.statusCode = statusCode || 500;
    this.success = false;
  }
}

module.exports = apiError;
