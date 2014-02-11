var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;
var crypto = require('crypto');

function generateToken(user) {
  var nowtime = new Date().getTime() / 1000;
  var token = crypto.createHash('sha1').update(user.username + nowtime.toString() + uuid.v4()).digest('hex');
  return token;
}

mongoose.connect('mongodb://127.0.0.1/UserDb');

var userSchema = mongoose.Schema({
  username: String,
  password: String,
  token: String,
  email: {type: String, default: 'example@example.com'},
  verified: {type: Boolean, default: false},
  verifytoken: String,
  aboutme: {type: String, default: "I'm a fucking dickhead"},
  createdat: {type: Date, default: Date.now}
});

userSchema.pre('save', function(next) {
  var user = this;

  (function(cb){

    if(!user.isModified('password')) return cb(null);
    
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if(err) return cb(err);

      bcrypt.hash(user.password, salt, function(err, hash) {
        if(err) return cb(err);
        user.password = hash;
        cb(null);
      });
    });
  }(function(err) {
    if (err) {
      console.log(err);
    }

    // user.verifytoken = generateToken(user);
    return next();
  }));
  
});

// Password verification
userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if(err) return cb(err);
    cb(null, isMatch);
  });
};

var User = mongoose.model('User', userSchema);

module.exports = User;