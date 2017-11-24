const express = require('express');
const path = require('path');
const app = express();
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const port = 5000;


//load routers
const ideas = require('./routes/ideas')
const users = require('./routes/users')

//Passport Config
require('./config/passport')(passport);

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

//Static folder
app.use(express.static(path.join(__dirname,'public')))

//Method override MiddleWare
app.use(methodOverride('_method'));

//Express session middleware
app.use(session({
  secret: 'tell me what you think',
  resave: true,
  saveUninitialized: true,
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//flash
app.use(flash());

//Global variables
app.use(function(req,res,next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null
  next();
})

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




//use router
app.use('/ideas',ideas);
app.use('/users',users);

app.listen(port, () => console.log(`app is running on port ${port}`))
