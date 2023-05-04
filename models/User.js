const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// model içinde middleware oluşturmak için 'pre' methodu kullanıldı.
// password alanını şifreleyip "hash" e çevirme ve veritabanımına şifrelenmiş şekilde kaydedtme
UserSchema.pre('save', function (next) {
  const user = this; // giriş yapan kullanıcıyı yakalamak için
  bcrypt.hash(user.password, 10, (error, hash) => {
    user.password = hash; // password, hash olarak kaydetme
    next();
  });
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
