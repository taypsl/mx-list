const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
  local: {
    username: String,
    email: String,
    password: String,
  }
 // resetPasswordToken: String,
 // resetPasswordExpires: Date
});

// methods

//generate hash
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// check password
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

//create user model and expose it to app
module.exports = mongoose.model('User', userSchema);
