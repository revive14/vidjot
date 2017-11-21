const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const passport = require('passport');
const router = express.Router();
//load user model
require('../models/User')
const User = mongoose.model('users');

//User login Route
router.get('/login', (req, res) => {
  res.render('users/login');
})

//User Register Route
router.get('/register', (req, res) => {
  res.render('users/register');
})

//Register form POST
router.post('/register', (req, res) => {
  let errors = []
  if (req.body.password != req.body.password2) {
    errors.push({
      text: 'Password do not match'
    })
  }
  if (req.body.password.length <= 5) {
    errors.push({
      text: 'Password must be atleast 5 characters'
    })
  }

  if (errors.length > 0) {
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
    })
  } else {
    User.findOne({email:req.body.email})
    .then(user=>{
      if(user){
        req.flash('error_msg','Email already exist')
        res.redirect('/users/login')
      }else{
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        })

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => {
                req.flash('success_msg', 'You are now registered');
                res.redirect('/users/login')
              })
              .catch(err => {
                console.log(err);
                return;
              })
          })
        });
      }
    })

  }
})


module.exports = router
