const router = require('express').Router();
const {
  createMovie,
  getMovies,
  deleteMovie,
  likeMovie,
  dislikeMovie,
} = require('../controllers/movies');

const {
  checkingCreateMovie,
  checkingMovieId,
} = require('../middlewares/validations');

router.post('/', checkingCreateMovie, createMovie);
router.get('/', getMovies);
router.delete('/:movieId', checkingMovieId, deleteMovie);
router.put('/:movieId/likes', checkingMovieId, likeMovie);
router.delete('/:movieId/likes', checkingMovieId, dislikeMovie);

module.exports = router;
