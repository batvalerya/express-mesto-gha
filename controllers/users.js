const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const OK = 200;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

const createUser = (req, res) => {
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
        .catch(() => {
          res.status(BAD_REQUEST).send({ message: 'Неверный логин или пароль' });
        });
    })
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};

const updateUser = async (req, res) => {
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
      res.status(NOT_FOUND).send({ message: 'Пользователь с указанным id не найден.' });
    }
  } catch (e) {
    if (e.name === 'ValidationError') {
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
    } else {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    }
  }
};

const getUserById = async (req, res) => {
  const id = req.params.userId;
  try {
    const user = await User.findById(id);

    if (user) {
      res.status(OK).send(user);
    } else {
      res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
    }
  } catch (e) {
    if (e.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при запросе пользователя' });
    } else {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    }
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(OK).send(users);
  } catch (e) {
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
  }
};

const updateAvatar = async (req, res) => {
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
      res.status(NOT_FOUND).send({ message: 'Пользователь с указанным id не найден.' });
    }
  } catch (e) {
    if (e.name === 'ValidationError') {
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
    } else {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    }
  }
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .orFail(() => new Error('Пользователе не найден'))
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
            res.status(UNAUTHORIZED).send({ message: 'Неправильный логин или пароль' });
          }
        });
    })
    .catch((e) => {
      res.send(e);
    });
};

module.exports = {
  createUser,
  getUserById,
  getUsers,
  updateUser,
  updateAvatar,
  login,
};
