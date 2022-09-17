const Card = require('../models/card');

const OK = 200;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(OK).send(cards);
  } catch (e) {
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const deleteCardById = async (req, res) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.cardId);

    if (card) {
      res.status(OK).send(card);
    } else {
      res.status(NOT_FOUND).send({ message: 'Карточка с указанным id не найдена.' });
    }
  } catch (e) {
    if (e.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Некорректный id карточки' });
    } else {
      res.status(500).send({ message: 'Произошла ошибка на сервере' });
    }
  }
};

const createCard = async (req, res) => {
  req.body.owner = req.user._id;
  try {
    const card = await new Card(req.body).save();
    res.status(OK).send(card);
  } catch (e) {
    if (e.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
    } else {
      res.status(500).send({ message: 'Произошла ошибка на сервере' });
    }
  }
};

const likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (card) {
      res.status(OK).send({ likes: card.likes });
    } else {
      res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
    }
  } catch (e) {
    if (e.name === 'CastError') {
      res.status(400).send({ message: 'Некорректный id карточки' });
    } else {
      res.status(500).send({ message: 'Произошла ошибка на сервере' });
    }
  }
};

const dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (card) {
      res.status(OK).send({ likes: card.likes });
    } else {
      res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
    }
  } catch (e) {
    if (e.name === 'CastError') {
      res.status(400).send({ message: 'Некорректный id карточки' });
    } else {
      res.status(500).send({ message: 'Произошла ошибка на сервере' });
    }
  }
};

module.exports = {
  getCards,
  deleteCardById,
  createCard,
  likeCard,
  dislikeCard,
};
