var validateSignUp = require('../lib/validatesignup');
var crypto = require('crypto');

module.exports = function(User, passport) {
  functions = {};

  functions.read = function (req, res) {

    User.findOne({username: req.user.username}, function(err, user) {
      if(err) {
        res.send("couldnt load " + req.user.usernames + " s info");
      } else {
        res.render('users/account', {user: user});
      }
    });
  };

  functions.new = function (req, res) {
    res.render('users/new', {errors: []});
  };

  functions.create = function (req, res) {
    console.log("we hit the post");
    validateSignUp(req, User, function(errors,status) {
      if(status) {
        // req.flash('failed', 'Task ' + req.params.id + ' was edited.');
        res.render('users/new', {errors: errors});
      } else {
        var newUser = new User(req.body);
        // newUser.username = req.body.username;
        // newUser.password = req.body.password;
        // newUser.email = req.body.email;
        var nowtime = new Date().getTime() / 1000;
        newUser.token = crypto.createHash('sha1').update(req.body.username + nowtime.toString()).digest('hex');
        res.cookie('rememberme', newUser.token, { signed: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        console.log(newUser.token);
        newUser.save(function(err) {
          if(err) {
            req.flash('failed', 'The user could not be created');
            res.render('users/new');
          } else {
            req.login(newUser, function(err) {
              if (err) {
                console.log(err);
                return res.redirect('/');
              }
              req.flash('success', 'A new user was created!');

              res.redirect('/account');
            });
          }
        })
      }
    });
  };

  functions.login = function (req, res) {
    res.render('users/login');
  };

  functions.postlogin = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      req.session.messages =  [info.message];
      return res.redirect('/login')
    }
    console.log(user);
    req.logIn(user, function(err) {
      if (err) { return next(err); }

      res.cookie('rememberme', user.token, { signed: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

      return res.redirect('/account');
    });
  })(req, res, next);
};


  functions.edit = function (req, res) {

  };

  functions.update = function (req, res) {

  };

  functions.logout = function (req, res) {

    res.clearCookie('rememberme');
    req.logout();
    res.redirect('/');
  };

  return functions;
}