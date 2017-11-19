const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser')
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

//Body Parser MiddleWare
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

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

//Process Form
app.post('/ideas',(req,res)=>{
  let errors = []
  if(!req.body.title){
    errors.push({text:'Please add title'})
  }
  if(!req.body.details){
    errors.push({text:'Please add some details'})
  }

  if(errors.length > 0){
    res.render('ideas/add',{
      errors: errors,
      title: req.body.title,
      details: req.body.details
     })
  }else{
    res.send('passed')
  }
})






app.listen(port, () => console.log(`app is running on port ${port}`))
