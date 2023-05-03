const express = require('express');

const app = express();

// template engine
app.set('view engine', 'ejs');

// middlewares
app.use(express.static('public')); 

// route
app.get('/', (req, res) => {
  res.render('index');
});
app.get('/about', (req, res) => {
  res.render('about');
});

const port = 3000;
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
