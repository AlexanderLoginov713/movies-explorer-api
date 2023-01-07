const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;
const { DEV_JWT_SECRET } = require('../utils/config');
const {
  USER_NOT_FOUND,
  WRONG_DATA_PROFILE,
  WRONG_DATA_USER,
  EMAIL_ALREADY_EXISTS,
  AUTH_SUCCESS,
  REG_SUCCESS,
  SIGNOUT_SUCCESS,
  WRONG_USER_ID,
} = require('../utils/constants');

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => { throw new NotFoundError(USER_NOT_FOUND); })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(WRONG_USER_ID));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.send({
      message: REG_SUCCESS,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(WRONG_DATA_USER));
      } else if (err.code === 11000) {
        next(new ConflictError(EMAIL_ALREADY_EXISTS));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .orFail(() => { throw new NotFoundError(USER_NOT_FOUND); })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(WRONG_DATA_PROFILE));
      } else if (err.code === 11000) {
        next(new ConflictError(EMAIL_ALREADY_EXISTS));
      } else next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : DEV_JWT_SECRET,
        { expiresIn: '7d' },
      );
      return res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      }).send({
        message: AUTH_SUCCESS,
        id: user._id,
      });
    })
    .catch(next);
};

module.exports.signout = (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
  }).status(200)
    .send({ message: SIGNOUT_SUCCESS });
};
