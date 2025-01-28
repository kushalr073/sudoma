const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    customerID: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures no two users have the same email
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'] // Validates email format
    },
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['user', 'admin'], // Restricts role to either 'user' or 'admin'
      required: true,
      default: 'user' // Sets default role to 'user'
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
  });


const User = mongoose.model('User', userSchema);

module.exports = User;