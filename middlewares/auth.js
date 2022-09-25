const jwt = require('jsonwebtoken');

const UNAUTHORIZED = 401;

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  let payload;

  try {
    payload = jwt.verify(token, 'SECRET');
  } catch (err) {
    res.status(UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;
  next();
};

module.exports = {
  auth,
};
