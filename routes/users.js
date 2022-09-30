const express = require('express');
const { celebrate, Joi } = require('celebrate');

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
    userId: Joi.string().alphanum().length(24),
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
    avatar: Joi.string().required().uri({
      scheme: ['http', 'https'],
    }),
  }),
}), updateAvatar);

module.exports = {
  userRoutes,
};
