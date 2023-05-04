const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      status: 'success',
      user,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body; // kullanıcının girdiği girdiler
    const user = await User.findOne({ email }); // emailden kullanıcı bulma
    if (user) { // eğer kullanıcı varsa
      bcrypt.compare(password, user.password, (error, same) => { // girilen şifre ile kayıtlı kullanıcı şifresini karşılaştırma
        if (same) { // şifreler aynıysa
          // user session
          res.status(200).send('success');
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};
