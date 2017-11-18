const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const port = 5000;

//handlebars middleware
app.engine('handlebars',exphbs({
  defaultLayout:'main'
}));
app.set('view engine','handlebars');

//index route
app.get('/',(req,res)=>{
  const title = 'welcome'
  res.render('index',{title: title})
})

//About route
app.get('/about',(req,res)=>{
  res.render('about')
})







app.listen(port,()=> console.log(`app is running on port ${port}`))
