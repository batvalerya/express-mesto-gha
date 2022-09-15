const Card = require('../models/card');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch (e) {
    res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const deleteCardById = async (req, res) => {
  const id = req.params.cardId;
  try {
    const card = await Card.findByIdAndDelete(id);

    if (!card) {
      res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      return;
    }
    res.status(200).send(card);
  } catch (e) {
    res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const createCard = async (req, res) => {
  req.body.owner = req.user._id;
  try {
    const card = await new Card(req.body).save();
    res.status(200).send(card);
  } catch (e) {
    if (e.name || e.link === 'ValidatorError') {
      res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      return;
    }
    res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      return;
    }
    res.status(200).send({ likes: card.likes });
  } catch (e) {
    res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      return;
    }
    res.status(200).send({ likes: card.likes });
  } catch (e) {
    res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

module.exports = {
  getCards,
  deleteCardById,
  createCard,
  likeCard,
  dislikeCard,
};
