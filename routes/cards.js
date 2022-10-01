const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { validateURL } = require('../validator');

const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const cardRouter = express.Router();

cardRouter.get('/cards', express.json(), getCards);
cardRouter.post('/cards', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(validateURL),
  }),
}), createCard);
cardRouter.delete('/cards/:cardId', express.json(), celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), deleteCardById);
cardRouter.put('/cards/:cardId/likes', express.json(), celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), likeCard);
cardRouter.delete('/cards/:cardId/likes', express.json(), celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), dislikeCard);

module.exports = {
  cardRouter,
};
