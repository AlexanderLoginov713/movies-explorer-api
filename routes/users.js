const router = require('express').Router();
const {
  getUsers,
  getUser,
  getUserById,
  updateUser,
} = require('../controllers/users');

const {
  checkingUserId,
  checkingUpdateUser,
} = require('../middlewares/validations');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:userId', checkingUserId, getUserById);
router.patch('/me', checkingUpdateUser, updateUser);

module.exports = router;
