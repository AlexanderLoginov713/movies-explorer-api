const jwt = require('jsonwebtoken');

const { DEV_JWT_SECRET } = require('../utils/config');

const UnauthorizedError = require('../errors/UnauthorizedError');
const { AUTHORIZATION_REQUIRED } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new UnauthorizedError(AUTHORIZATION_REQUIRED));
  }
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : DEV_JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError(AUTHORIZATION_REQUIRED));
  }
  req.user = payload;
  return next();
};

module.exports = auth;
