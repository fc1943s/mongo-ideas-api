const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const auth = require('../auth');


const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  email: String,
  password: String,
});

userSchema.pre('save', async (err, user, next) => {
  user.password = auth.hashPassword(user.password);
  next();
});

userSchema.methods.authenticate = function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
