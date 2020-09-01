const express = require('express');
const path = require('path');
const passport = require('passport');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');


const app = express();
//load view engine
app.set('views', path.join(__dirname, 'public') );
app.set('view engine', 'pug');

// body-parser middleware
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


//setPublic Folder
app.use(express.static(path.join(__dirname, 'views')));


//Express Session middleware
app.use(session({
    secret: 'Eddy is the goat',
    resave: true,
    saveUninitialized: true,
  //  cookie: { secure: true }
  }));

//Express message middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));




// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

//Home Route
app.get('/',function(req, res){
       
          res.render('index', {
            title: 'Welcome',
           
          });
        });
// Route Files
//let voters= require('./routes/voters');
let customer= require('./routes/customer');
//app.use('/voters', voters);
app.use('/customer', customer);
//app.use('/poll', poll);
//start Server
const port = 3000;

// Start server
app.listen(port, () => console.log(`Server started on port ${port}`));
