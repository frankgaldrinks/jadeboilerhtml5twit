module.exports = function(User) {
  functions = {};

  functions.index = function (req, res) {
    res.render('index', { user: req.user });
  };

  functions.verify = function (req, res) {
    if (req.query.tok) {
      var verifytoken = req.query.tok;
      User.findOne({verifytoken: verifytoken}, function(err, user) {
        if (user) {
          user.verified = true;
          user.save(function(err) {
            res.send("You're now verified");
          });
        } else {
          res.send("That verify token did not work");
        }
      });
    } else {
      res.send('stop trying to hack!');
    }
  };

  return functions;
};