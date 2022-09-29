const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/UnauthorizedError');

const UNAUTHORIZED = 401;

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  let payload;

  try {
    payload = jwt.verify(token, 'SECRET');
  } catch (err) {
    next(new UnauthorizedError(UNAUTHORIZED, 'Необходима авторизация'));
  }

  req.user = payload;
  next();
};

module.exports = {
  auth,
};
