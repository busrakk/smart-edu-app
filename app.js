const express = require('express');
const mongoose = require('mongoose'); // simple, schema for modeling data
const session = require('express-session'); // kişiye özel içerik oluşturmak için kullanıcı bilgilerinin sunucu tarafında saklanmasını sağlayan araç
const MongoStore = require('connect-mongo'); // MongoDB oturum deposu - sunucuyu tekrar başlatıldığında oturumu kaybetmemek için
const flash = require('connect-flash');
const methodOverride = require('method-override');
const dotenv = require('dotenv');
dotenv.config();

const pageRoute = require('./routes/pageRoute');
const courseRoute = require('./routes/courseRoute');
const categoryRoute = require('./routes/categoryRoute');
const userRoute = require('./routes/userRoute');

const app = express();

// connect db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully Connected!'))
  .catch((err) => console.error(err));

// template engine
app.set('view engine', 'ejs');

// global variable
global.userIN = null; // false

// middlewares
app.use(express.static('public'));
// body'den gelen verileri yakalamk için
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'my_keyboard_cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: 'process.env.MONGO_URI',
    }),
    //cookie: { secure: true }
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});
app.use(
  methodOverride('_method', {
    methods: ['GET', 'POST'],
  })
);

// route
app.use('*', (req, res, next) => {
  userIN = req.session.userID; // userIn bir değeri olursa true - giriş yapılırsa
  next();
});
app.use('/', pageRoute); // '/' ile başlayan istekleri pageRoute yönlendirir
app.use('/courses', courseRoute);
app.use('/categories', categoryRoute);
app.use('/users', userRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
