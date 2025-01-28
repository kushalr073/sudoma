const mongoose = require('mongoose');

const OocyteSampleSchema = new mongoose.Schema({
  donorName: {
    type: String,
    required: true
  },
  aadharNumber: {
    type: String,
    required: true,
    unique: true
  },
  collectionMethod: {
    type: String,
    enum: ['Method1', 'Method2', 'Other'], // Replace with actual options
    required: true
  },
  collectionPlace: {
    type: String,
    required: true
  },
  sampleQuantity: {
    type: Number,
    required: true
  },
  collectionDate: {
    type: Date,
    required: true
  },
  storagePlace: {
    type: String,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  source: {
    type: String,
    required: true,
    default:"ART Bank 1"
  },
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
  issued: {
    type: Boolean,
    default: false,
  },
  issuedToRequest:{
    type:String,
    default:null
  }
});

const OocyteSample = mongoose.model('OocyteSample', OocyteSampleSchema);

module.exports = OocyteSample;
