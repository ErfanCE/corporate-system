const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  firstname: String,
  lastname: String,
  dateOfBirth: Date,
  username: String,
  password: String,
  gender: String,
  role: String,
  phoneNumber: [String],
  mass: Number,
  city: String,
  isMarried: Boolean
});

module.exports = model('User', UserSchema);
