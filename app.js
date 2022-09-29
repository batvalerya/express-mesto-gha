const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { cardRouter } = require('./routes/cards');

const { userRoutes } = require('./routes/users');

const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const errorHandler = require('./middlewares/error');

const { PORT = 3000 } = process.env;

const app = express();

app.post('/signup', express.json(), createUser);
app.post('/signin', express.json(), login);

app.use(cookieParser());
app.use(auth);
app.use(userRoutes);
app.use(cardRouter);
app.use(errorHandler);

app.patch('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });

  await app.listen(PORT);
}

main();
