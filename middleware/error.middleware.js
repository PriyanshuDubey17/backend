const errorHandler = (err, req, res, next) => {
  console.log(err.message, err.statusCode);
  const message = err.message || "internal server issue ";
  const statusCode = err.statusCode || 500;
  const success = err.success || false;

  res.status(statusCode).json({
    message,
    success,
  });
};
module.exports = errorHandler;
