var validator = require('validator');

module.exports = function(req, User, cb) {
  var errors = {
    username: [],
    password: [],
    email: []
  };
  
  var username = req.body.username.trim();
  var password = req.body.password.trim();
  var verifypassword = req.body.verifypassword.trim();
  var email = req.body.email.trim();

  var status = false;

  //validate password length
  if (!validator.isLength(password, 4, 16)) {
    errors.password.push('The length is not between 4 and 16 characters');
    status = true;
  }

  //validates that it is the correct email
  if(!validator.isEmail(email)) {
    errors.email.push("That is not a valid email");
    status = true;
  }

  //check is the length of the username is greater than 0
  if (username.length > 0) {
    
    //validate username contains letters
    if (validator.isNumeric(username)) {
      errors.username.push('The username must contain letters and numbers, not just numbers');
      status = true;
    }
    //checks if the username contains non alpha numeric numers
    if (!validator.isAlphanumeric(username)) {
      errors.username.push('The username must not contain non-alphanumeric characters');
      status = true;
    } 
  } else {
    errors.username.push('The username must be atleast 1 character long');
    status = true;
  }

  //checks if the username aleady exists only if there are no other validation errors for the username
  if (errors.username.length === 0) {
    User.findOne({username: username}, function(err,user) {

      if (user !== null) {
        errors.username.push('That username already exists');
        status = true;
      }
    });
  }

  if (password !== verifypassword) {
    errors.password.push("The passwords do not match");
    status = true;
  }


  if (status) {
    cb(errors, true);
  } else {
    cb(null, false);
  }


};