const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const DEV_DATABASE_PATH = 'mongodb://localhost:27017/moviesdb';
const DEV_JWT_SECRET = 'dev-secret';

module.exports = {
  DEV_DATABASE_PATH,
  DEV_JWT_SECRET,
  limiter,
};
