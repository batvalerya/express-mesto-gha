const express = require('express');
const { createUser, getUserById, getUsers } = require('../controllers/users');

const userRoutes = express.Router();

userRoutes.post('/users', express.json(), createUser);
userRoutes.get('/users/:userId', express.json(), getUserById);
userRoutes.get('/users', express.json(), getUsers);

module.exports = {
  userRoutes,
};
