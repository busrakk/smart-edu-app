const User = require('../models/User');
const Category = require('../models/Category');
const Course = require('../models/Course');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).redirect('/login');
    // res.status(201).json({
    //   status: 'success',
    //   user,
    // });
  } catch (error) {
    const errors = validationResult(req);

    for (let i = 0; i < errors.array().length; i++) {
      req.flash('error', `${errors.array()[i].msg}`);
    }

    res.status(400).redirect('/register');
    // console.log(errors.array()[0].msg);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body; // kullanıcının girdiği girdiler
    const user = await User.findOne({ email }); // emailden kullanıcı bulma
    if (user) {
      // eğer kullanıcı varsa
      bcrypt.compare(password, user.password, (error, same) => {
        // girilen şifre ile kayıtlı kullanıcı şifresini karşılaştırma
        // şifreler aynıysa
        // user session
        // oturum açan kullanıcıyı belirlemek için.
        if (same) {
          req.session.userID = user._id; // giriş işlemi sırasında kullanıcı ID'sini session alanında userID değişkenini oluşturup ona atama
          res.status(200).redirect('/users/dashboard');
        } else {
          req.flash('error', 'Your password is not correct');
          res.status(400).redirect('/login');
        }
      });
    } else {
      req.flash('error', 'User is not exist!');
      res.status(400).redirect('/login');
    }
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.logoutUser = (req, res) => {
  req.session.destroy();
  res.status(200).redirect('/');
};

exports.getDashboardPage = async (req, res) => {
  const user = await User.findOne({ _id: req.session.userID }).populate(
    'courses'
  ); // giriş yapan kullanıcıyı bulma
  const categories = await Category.find(); // tüm kategorileri çağırma
  const courses = await Course.find({ user: req.session.userID }); // kurslara ait teacher
  res.status(200).render('dashboard', {
    page_name: 'dashboard',
    user,
    categories,
    courses,
  });
};
