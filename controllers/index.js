module.exports = function() {
  functions = {};

  functions.index = function (req, res) {
    res.render('index', { user: req.user });
  };

  return functions;
};