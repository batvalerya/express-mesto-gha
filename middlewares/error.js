const errorHandler = (err, req, res, next) => {
  const statusCode = err.code || 500;

  const message = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;

  res.status(statusCode).send({ message });

  next(err);
};

module.exports = errorHandler;
