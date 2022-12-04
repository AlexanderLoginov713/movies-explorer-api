const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

const {
  WRONG_DATA_MOVIE,
  WRONG_DATA_MOVIE_DELETE,
  MOVIE_NOT_FOUND,
  ACCESS_ERROR,
  MOVIE_DELETED,
} = require('../utils/constants');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => Movie.create({ ...req.body, owner: req.user._id })
  .then((movie) => res.send(movie))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(WRONG_DATA_MOVIE));
    } else {
      next(err);
    }
  });

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFoundError(MOVIE_NOT_FOUND);
    })
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError(ACCESS_ERROR);
      }
      return movie.remove()
        .then(() => res.send({ message: MOVIE_DELETED }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(WRONG_DATA_MOVIE_DELETE));
      } else {
        next(err);
      }
    });
};
