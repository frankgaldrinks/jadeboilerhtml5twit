module.exports = function() {
  var functions = {};

  functions.index = function(req,res) {
    console.log("We imported the routes!");
    res.render('index', { title: 'Express' });
  };

  return functions;
};