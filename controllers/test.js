const deleteCardById = (req, res, next) => Card.findById(req.params.cardId)
  .orFail(() => new Error('Карточка с указанным id не найдена.'))
  .then((card) => {
    if (card.owner._id.toString() === req.user._id) {
      return card.remove()
        .then((removedCard) => {
          res.status(OK).send(removedCard);
        })
        .catch(next);
    }
    throw new Error('Доступ запрещен');
  })
  .catch((e) => {
    if (e.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Некорректный id карточки' });
    } else {
      res.status(500).send({ message: 'Произошла ошибка на сервере' });
    }
  });