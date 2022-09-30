const express = require('express');
const { celebrate, Joi } = require('celebrate');

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
    link: Joi.string().required(),
  }),
}), createCard);
cardRouter.delete('/cards/:cardId', express.json(), celebrate({
  body: Joi.object().keys({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }),
}), deleteCardById);
cardRouter.put('/cards/:cardId/likes', express.json(), celebrate({
  body: Joi.object().keys({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }),
}), likeCard);
cardRouter.delete('/cards/:cardId/likes', express.json(), celebrate({
  body: Joi.object().keys({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }),
}), dislikeCard);

module.exports = {
  cardRouter,
};
