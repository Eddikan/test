const LocalStrategy = require('passport-local').Strategy;
 const Customer = require('../models/customer');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = function(passport){

//use two LocalStrategies,

  // Local Strategy
  passport.use('customerLocal', new LocalStrategy(function(username, password, done){
    // Match Username
    let query = {username:username};
    Customer.findOne(query, function(err, customer){
      if(err) throw err;
      if(!customer){
        return done(null, false, {message: 'No user found'});
      }

      // Match Password
      bcrypt.compare(password, customer.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null, customer);
        } else {
          return done(null, false, {message: 'Wrong password'});
        }
      });
    });
  }
  ));






  passport.serializeUser(function(user, done) { 
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    if(user!=null)
      done(null,user);
  });

}
