const router = require('express').Router();
const {
  createMovie,
  getMovies,
  deleteMovie,
} = require('../controllers/movies');

const {
  checkingCreateMovie,
  checkingDeleteMovie,
} = require('../middlewares/validations');

router.post('/', checkingCreateMovie, createMovie);
router.get('/', getMovies);
router.delete('/:movieId', checkingDeleteMovie, deleteMovie);

module.exports = router;
