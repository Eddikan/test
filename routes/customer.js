const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');


//Bring in models
//let Farmer = require('../models/farmer');
let Customer = require('../models/customer');


 //Add customer route
 router.get('/', function(req, res){
  Customer.find({}, function(err, customers){
    if(err){
      console.log(err);
    }else{
  res.render('customer', {
    title: 'Welcome chief',
    customers: customers
  });
}
  });
});

// Register form
router.get('/add', function(req, res){
  res.render('customer_signup', {
    title: 'Signup today!'
  });
});

//customer register process
router.post('/add', function(req, res){
  let name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  let errors = req.validationErrors();

  if(errors){
    res.render('customer_signup', {
      errors:errors
    });
  } else {
    let newCustomer = new Customer({
      name:name,
      email:email,
      username:username,
      password:password
    });
    // hash password
    bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash(newCustomer.password, salt, function(err, hash){
      if(err){
        console.log(err);
      }
      newCustomer.password = hash;
      newCustomer.save(function(err){
        if(err){
          console.log(err);
          return;
        } else {
          req.flash('success','You have registered, please login');
          res.redirect('/customer/login');
        }
      });
    });
  });
}
});
// login form
router.get('/login', function(req, res){
  res.render('customer_login');
});

// Login Process
router.post('/login', function(req, res, next){
  passport.authenticate('customerLocal', {
    successRedirect:'/customer',
    failureRedirect:'/customer/login',
    failureFlash: true
  })(req, res, next);
});

// logout
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/customer/login');
});

// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/customer/login');
  }
}
module.exports= router;
