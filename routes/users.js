const express = require('express');

const {
  getUserById,
  getUsers,
  updateUser,
  updateAvatar,
  getUserInfo,
} = require('../controllers/users');

const userRoutes = express.Router();

userRoutes.get('/users/me', express.json(), getUserInfo);
userRoutes.get('/users/:userId', express.json(), getUserById);
userRoutes.get('/users', express.json(), getUsers);
userRoutes.patch('/users/me', express.json(), updateUser);
userRoutes.patch('/users/me/avatar', express.json(), updateAvatar);

module.exports = {
  userRoutes,
};
