const User = require('../models/user');

const createUser = async (req, res) => {
  try {
    const user = await new User(req.body).save();
    res.status(200).send(user);
  } catch (e) {
    if (e.errors.avatar.name === 'ValidatorError') {
      res.status(400).send({ message: 'Ошибка в запросе' });
      return;
    }
    res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);

    if (!user) {
      res.status(404).send({ message: 'Такого пользователя не существует' });
      return;
    }
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (e) {
    res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      req.params._id,
      { $set: { name: req.body.name, about: req.body.about } },
      { new: true },
    );
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const updateAvatar = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      req.params._id,
      { $set: { avatar: req.body.avatar } },
      { new: true },
    );
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

module.exports = {
  createUser,
  getUserById,
  getUsers,
  updateUser,
  updateAvatar,
};
