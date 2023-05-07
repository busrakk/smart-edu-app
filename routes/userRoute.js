const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const { body } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

router.route('/signup').post(
  // form alanına bilgiler eklenmiş mi diye kontrol
  // custom ile kayıtlı email kontrolü
  [
    body('name').not().isEmpty().withMessage('Please Enter Your Name'),
    body('email')
      .not()
      .isEmpty()
      .withMessage('Please Enter Valid Email')
      .custom((userEmail) => {
        return User.findOne({ email: userEmail }).then((user) => {
          if (user) {
            return Promise.reject('Email Already Exists');
          }
        });
      }),
    body('password').not().isEmpty().withMessage('Please Enter A Password'),
  ],
  authController.createUser
); // http://localhost:3000/users/signup
router.route('/login').post(authController.loginUser); // http://localhost:3000/users/login
router.route('/logout').get(authController.logoutUser); // http://localhost:3000/users/logout
router.route('/dashboard').get(authMiddleware, authController.getDashboardPage); // http://localhost:3000/users/dashboard
router.route('/:id').delete(authController.deleteUser);

module.exports = router;
