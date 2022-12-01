const router = require('express').Router();
const {
  getUser,
  updateUser,
} = require('../controllers/users');

const {
  checkingUpdateUser,
} = require('../middlewares/validations');

router.get('/me', getUser);
router.patch('/me', checkingUpdateUser, updateUser);

module.exports = router;
