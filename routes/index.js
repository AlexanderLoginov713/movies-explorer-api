const router = require('express').Router();
const userRouter = require('./users');
const moviesRouter = require('./movies');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

const { createUser, login, signout } = require('../controllers/users');

const {
  checkingCreateUser,
  checkingLogin,
} = require('../middlewares/validations');

router.post('/signup', checkingCreateUser, createUser);
router.post('/signin', checkingLogin, login);

router.use(auth);
router.get('/signout', signout);
router.use('/users', userRouter);
router.use('/movies', moviesRouter);
router.use('*', (req, res, next) => next(new NotFoundError('Запрашиваемый ресурс не найден')));

module.exports = router;
