const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const port = 5000;

//Map Global promise- get rid of warning
mongoose.Promise = global.Promise
//Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
    useMongoClient: true
  })
  .then(() => console.log('mongodb connected'))
  .catch(err => console.log('error'))

//Load Idea model
require('./models/Idea');
const Idea = mongoose.model('ideas');


//handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//index route
app.get('/', (req, res) => {
  const title = 'welcome'
  res.render('index', {
    title: title
  })
})

//About route
app.get('/about', (req, res) => {
  res.render('about')
})

//Add Idea Form route
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add')
})






app.listen(port, () => console.log(`app is running on port ${port}`))
