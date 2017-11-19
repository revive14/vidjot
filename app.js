const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Method override MiddleWare
app.use(methodOverride('_method'));

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

//Idea index page
app.get('/ideas',(req,res)=>{
  Idea.find({})
  .sort({date:'desc'})
  .then(ideas =>{
    res.render('ideas/index',{ideas: ideas})
  })
})

//Add Idea Form route
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add')
})

//Edit Idea Form route
app.get('/ideas/edit/:id', (req, res) => {
  Idea.findOne({
    _id:req.params.id
  })
  .then(idea =>{
    res.render('ideas/edit',{idea: idea});
  })

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
    const newUser = {
      title: req.body.title,
      details: req.body.details
    }
    new Idea(newUser)
    .save()
    .then(idea =>{
      res.redirect('/ideas')
    })
  }
})

//Edit Form Process
app.put('/ideas/:id',(req,res)=>{
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea=>{
    //new values
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save()
    .then(idea=>{
      res.redirect('/ideas')
    })

  })
})




app.listen(port, () => console.log(`app is running on port ${port}`))
