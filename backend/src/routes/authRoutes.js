const express = require('express');
const authController = require('../controllers/authController');
const {
  validateRegister,
  validateLogin,
  handleValidation,
} = require('../middleware/validation');

const router = express.Router();

router.post(
  '/register',
  validateRegister,
  handleValidation,
  authController.register
);
router.post('/login', validateLogin, handleValidation, authController.login);

module.exports = router;

