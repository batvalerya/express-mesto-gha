const express = require('express');
const mongoose = require('mongoose');
const { userRoutes } = require('./routes/users');

const { PORT = 3000 } = process.env;

const app = express();

app.use(userRoutes);

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });

  await app.listen(PORT);
}

main();
