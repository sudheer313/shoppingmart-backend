const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode || 500;

  return res.status(statusCode).json({
    sucess: false,
    message: err.message,
  });
};

module.exports = errorHandler;
