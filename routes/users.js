const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { validateURL } = require('../validator');

const {
  getUserById,
  getUsers,
  updateUser,
  updateAvatar,
  getUserInfo,
} = require('../controllers/users');

const userRoutes = express.Router();

userRoutes.get('/users/me', express.json(), getUserInfo);
userRoutes.get('/users/:userId', express.json(), celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUserById);
userRoutes.get('/users', express.json(), getUsers);
userRoutes.patch('/users/me', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);
userRoutes.patch('/users/me/avatar', express.json(), celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validateURL),
  }),
}), updateAvatar);

module.exports = {
  userRoutes,
};
