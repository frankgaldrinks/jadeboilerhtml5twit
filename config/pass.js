module.exports = function(User) {
  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;

  passport.use(new LocalStrategy(function(username, password, done) {

    User.findOne( {username: username}, function(err, user) {
      //if the db errors out
      if (err) { return done(err); }

      if (!user) { return done(null, false, { message: 'Unknown user ' + username}); }

      user.comparePassword(password, function(err, isMatch) {
        if (err) return done(err);
        if(isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Invalid password' });
        }
      });
    });
  }));

  passport.serializeUser(function(user, done) {
    console.log("serializing " + user);
    done(null, user.username);
  });

  passport.deserializeUser(function(username, done) {
    console.log("deserializing " + username);
    User.findOne({username: username}, function(err, user) {
      done(null, {username: user.username});
    });
  });

  return passport;
};
