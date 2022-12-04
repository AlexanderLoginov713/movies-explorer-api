require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('./middlewares/cors');
const router = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { limiter, DEV_DATABASE_PATH } = require('./utils/config');

const { PORT = 3001, NODE_ENV, PRODUCTION_DATABASE_PATH } = process.env;
const app = express();
app.use(requestLogger);
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use(cors);

app.use(limiter);
app.use(helmet());

mongoose.connect(NODE_ENV === 'production' ? PRODUCTION_DATABASE_PATH : DEV_DATABASE_PATH, {
  useNewUrlParser: true,
});
app.use(cookieParser());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', router);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
