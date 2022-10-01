const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors, Joi, celebrate } = require('celebrate');
const { cardRouter } = require('./routes/cards');
const { NotFoundError } = require('./errors/NotFoundError');

const { userRoutes } = require('./routes/users');

const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const errorHandler = require('./middlewares/error');
const { validateURL } = require('./validator');

const { PORT = 3000 } = process.env;

const app = express();

app.post('/signup', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateURL),
  }),
}), createUser);

app.post('/signin', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

app.use(cookieParser());
app.use(auth);
app.use(userRoutes);
app.use(cardRouter);
app.use((req, res, next) => {
  next(new NotFoundError(404, 'Страница не найдена'));
});
app.use(errors());
app.use(errorHandler);

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });

  await app.listen(PORT);
}

main();
