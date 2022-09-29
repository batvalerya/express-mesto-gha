const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFoundError } = require('../errors/NotFoundError');
const { BadRequestError } = require('../errors/BadRequestError');
const { DocumentNotFoundError } = require('../errors/DocumentNotFoundError');
const { UnauthorizedError } = require('../errors/UnauthorizedError');
const { ConflictError } = require('../errors/ConflictError');

const OK = 200;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const NOT_FOUND = 404;
const CONFLICT_ERROR = 409;

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hashedPassword) => {
      User.create({
        email, name, about, avatar, password: hashedPassword,
      })
        .then((user) => res.send({ data: user }))
        .catch((err) => {
          if (err.code === 11000) {
            next(new ConflictError(CONFLICT_ERROR, 'Логин занят'));
          } else {
            next(new BadRequestError(BAD_REQUEST, 'Некорректный запрос'));
          }
        });
    })
    .catch((err) => {
      next(err);
    });
};

const updateUser = async (req, res, next) => {
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    );

    if (user) {
      res.status(OK).send(user);
    } else {
      next(new NotFoundError(NOT_FOUND, 'Пользователь с указанным id не найден.'));
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(BAD_REQUEST, 'Переданы некорректные данные при обновлении профиля'));
    } else {
      next(err);
    }
  }
};

const getUserById = async (req, res, next) => {
  const id = req.params.userId;
  try {
    const user = await User.findById(id);

    if (user) {
      res.status(OK).send(user);
    } else {
      next(new NotFoundError(NOT_FOUND, 'Пользователь по указанному _id не найден.'));
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError(BAD_REQUEST, 'Переданы некорректные данные при запросе пользователя'));
    } else {
      next(err);
    }
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(OK).send(users);
  } catch (err) {
    next(err);
  }
};

const getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(OK).send(user);
  } catch (err) {
    next(err);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
      req.user._id,
      { $set: { avatar: req.body.avatar } },
      {
        new: true,
        runValidators: true,
      },
    );
    if (user) {
      res.status(OK).send(user);
    } else {
      next(new NotFoundError(NOT_FOUND, 'Пользователь по указанному _id не найден.'));
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(BAD_REQUEST, 'Переданы некорректные данные при обновлении аватара'));
    } else {
      next(err);
    }
  }
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .orFail()
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((isUserValid) => {
          if (isUserValid) {
            const token = jwt.sign({
              _id: user._id,
            }, 'SECRET');

            res.cookie('jwt', token, {
              maxAge: 3600000,
              httpOnly: true,
              sameSite: true,
            });

            res.send({ data: user });
          } else {
            next(new UnauthorizedError(UNAUTHORIZED, 'Неправильный логин или пароль'));
          }
        });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new DocumentNotFoundError(NOT_FOUND, 'Пользователь с таким логином не найден'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  getUserById,
  getUsers,
  updateUser,
  updateAvatar,
  login,
  getUserInfo,
};
