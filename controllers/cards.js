const Card = require('../models/card');
const { NotFoundError } = require('../errors/NotFoundError');
const { BadRequestError } = require('../errors/BadRequestError');
const { ForbiddenError } = require('../errors/ForbiddenError');

const OK = 200;
const BAD_REQUEST = 400;
const FORBIDDEN = 403;
const NOT_FOUND = 404;

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.status(OK).send(cards);
  } catch (err) {
    next(err);
  }
};

const deleteCardById = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (card.owner._id.toString() === req.user._id) {
      card.remove();
      res.status(OK).send(card);
    } else {
      next(new ForbiddenError(FORBIDDEN, 'Доступ запрещен'));
    }

    // const card = await Card.findByIdAndDelete(req.params.cardId);
    // if (card) {
    //   res.status(OK).send(card);
    // } else {
    //   next(new NotFoundError(NOT_FOUND, 'Карточка с указанным id не найдена.'));
    // }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new NotFoundError(NOT_FOUND, 'Карточка с указанным id не найдена.'));
    } else {
      next(err);
    }
  }
};

const createCard = async (req, res, next) => {
  req.body.owner = req.user._id;
  try {
    const card = await new Card(req.body).save();
    res.status(OK).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(BAD_REQUEST, 'Переданы некорректные данные при создании карточки.'));
    } else {
      next(err);
    }
  }
};

const likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (card) {
      res.status(OK).send({ likes: card.likes });
    } else {
      next(new NotFoundError(NOT_FOUND, 'Карточка с указанным id не найдена.'));
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError(BAD_REQUEST, 'Некорректный id карточки'));
    } else {
      next(err);
    }
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (card) {
      res.status(OK).send({ likes: card.likes });
    } else {
      next(new NotFoundError(NOT_FOUND, 'Карточка с указанным id не найдена.'));
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError(BAD_REQUEST, 'Некорректный id карточки'));
    } else {
      next(err);
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
