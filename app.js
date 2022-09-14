const express = require('express');

const mongoose = require('mongoose');
const { cardRouter } = require('./routes/cards');

const { userRoutes } = require('./routes/users');

const { PORT = 3000 } = process.env;

const app = express();

app.use(userRoutes);

app.use((req, res, next) => {
  req.user = {
    _id: '631de596825c8a3d2a5a8405',
  };

  next();
});

app.use(cardRouter);

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });

  await app.listen(PORT);
}

main();
