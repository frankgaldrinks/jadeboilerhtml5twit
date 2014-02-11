var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var User = require('./models/user');
var passport = require('./config/pass')(User);

var app = express();
var server = http.createServer(app);

//controllers
var users = require('./controllers/users')(User, passport);
var basic = require('./controllers/index')(User);

function ensureAuthenticated(req,res,next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

function ifAuthenticated(req,res,next) {
  if (req.isAuthenticated()) {
    res.redirect('/account');
  }
  return next();
}

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('key board'));
app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function (req, res, next) {
 
  if (!req.user) {
    console.log("We are not authenticated");
    if (req.signedCookies.rememberme) {
      console.log("we have a cookie at " + req.signedCookies.rememberme);
      User.findOne({token: req.signedCookies.rememberme}, function (err, user) {
        if (user) {
          req.logIn(user, function(err) {
            if (err) {
              console.log(err);
            } else {
              return next();
              console.log("we are set");
            }
          });
        } else {
          return next();
        }
      });
    } else {
      return next();
    }
  } else {
    return next();
  }
});
app.use(app.router);
app.use(function (req, res) {
  res.redirect('/');
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//basic routes
app.get('/', basic.index);
app.get('/verify', basic.verify);

//user routes
app.get('/account', ensureAuthenticated, users.read);
app.get('/signup', ifAuthenticated, users.new);
app.post('/signup',ifAuthenticated, users.create);
app.get('/login', ifAuthenticated, users.login);
app.post('/login', ifAuthenticated, users.postlogin);
app.get('/account/settings',ensureAuthenticated, users.edit);
app.put('/account/edit',ensureAuthenticated, users.update);
app.get('/logout', users.logout);


server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
