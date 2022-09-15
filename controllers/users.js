const User = require('../models/user');

const createUser = async (req, res) => {
  try {
    const user = await new User(req.body).save();
    res.status(200).send(user);
  } catch (e) {
    if (e.name || e.about || e.avatar === 'ValidatorError') {
      res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      return;
    }
    res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
  }
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

    if (!user) {
      res.status(404).send({ message: 'Пользователь с указанным id не найден.' });
      return;
    }
    res.status(200).send(user);
  } catch (e) {
    if (e.name || e.about === 'ValidatorError') {
      res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
    }
    res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const getUserById = async (req, res) => {
  const id = req.params.userId;
  try {
    const user = await User.findById(id);

    if (!user) {
      res.status(400).send({ message: 'Пользователь по указанному _id не найден.' });
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

const updateAvatar = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      req.user._id,
      { $set: { avatar: req.body.avatar } },
      { new: true },
    );
    if (!user) {
      res.status(404).send({ message: 'Пользователь с указанным id не найден.' });
      return;
    }
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
