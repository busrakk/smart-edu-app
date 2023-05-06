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
  role: {
    type: String,
    enum: ['admin', 'teacher', 'student'],
    default: 'student',
  },
  courses: [
    {
      // courses alanı bir array ve öğrenci her yeni kursa kaydolduğunda bu arraye yeni bir kurs bilgisi eklenecek
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
  ],
});

// model içinde middleware oluşturmak için 'pre' methodu kullanıldı.
// password alanını şifreleyip "hash" e çevirme ve veritabanımına şifrelenmiş şekilde kaydedtme
UserSchema.pre('save', function (next) {
  const user = this; // giriş yapan kullanıcıyı yakalamak için

  // user modelinde değişiklik olduğunda şifreyi yeniden hashlenmemesi için
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
