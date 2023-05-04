const express = require('express');
const mongoose = require('mongoose'); // simple, schema for modeling data
const pageRoute = require('./routes/pageRoute');
const courseRoute = require('./routes/courseRoute');
const categoryRoute = require('./routes/categoryRoute');

const app = express();

// connect db
mongoose
  .connect('mongodb://127.0.0.1:27017/smartedu-app-db')
  .then(() => console.log('Successfully Connected!'))
  .catch((err) => console.error(err));

// template engine
app.set('view engine', 'ejs');

// middlewares
app.use(express.static('public'));
// body'den gelen verileri yakalamk için
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// route
app.use('/', pageRoute); // '/' ile başlayan istekleri pageRoute yönlendirir
app.use('/courses', courseRoute);
app.use('/categories', categoryRoute);

const port = 3000;
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
