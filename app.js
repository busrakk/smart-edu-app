const express = require('express');
const pageRoute = require('./routes/pageRoute');

const app = express();

// template engine
app.set('view engine', 'ejs');

// middlewares
app.use(express.static('public'));

// route
app.use('/', pageRoute); // '/' ile başlayan istekleri pageRoute yönlendirir

const port = 3000;
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
