const express = require('express');

const mongoose = require('mongoose');
const { cardRouter } = require('./routes/cards');

const { userRoutes } = require('./routes/users');

const { PORT = 3000 } = process.env;

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '631de596825c8a3d2a5a8405',
  };

  next();
});

app.use(userRoutes);

app.use(cardRouter);

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
