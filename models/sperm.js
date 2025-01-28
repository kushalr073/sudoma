const mongoose = require('mongoose');


const SpermSchema = new mongoose.Schema({
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
    required: true,
  },
  height: {
    type: Number, 
    required: true,
  },
  weight: {
    type: Number, 
    required: true,
  },
  bmi: {
    type: Number,
    default: function () {
      return this.weight / ((this.height / 100) ** 2);
    },
  },
  eyeColor: {
    type: String,
    enum: ['Black', 'Brown', 'Green', 'Blue', 'Grey'],
    required: true,
  },
  skinColor: {
    type: String,
    enum: ['Very Fair', 'Fair Skin', 'Medium Skin', 'Light Brown', 'Dark Brown', 'Black Skin'],
    required: true,
  },
  hairColor: {
    type: String,
    enum: ['Black', 'Dark Brown', 'Light Brown', 'Dark Blonde', 'Light Blonde'],
    required: true,
  },
  artBank: {
    type:String,
    required: true,
  },
  received: {
    type:Boolean,
    default: false,
  },
  spermSampleId: {
    type:String,
    default:null
  }
});


const Sperm = mongoose.model('Sperm', SpermSchema);

module.exports = Sperm;
