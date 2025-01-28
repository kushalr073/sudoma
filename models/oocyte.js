const mongoose = require('mongoose');

// Define the schema
const oocyteSchema = new mongoose.Schema({
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
    required: true,
  },
  height: {
    type: Number, // In centimeters or as per required units
    required: true,
  },
  weight: {
    type: Number, // In kilograms or as per required units
    required: true,
  },
  bmi: {
    type: Number, // Automatically calculated
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
  state: {
    type: String,
    enum: [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
      'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
      'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
      'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
      'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
      'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
      'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
      'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
    ],
    required: true,
  },
  artBank:{
    type:String,
    required:true,
  },
  received: {
    type:Boolean,
    default: false,
  },
  donorSampleId: {
    type:String,
    default:null
  }
});

// Create the model
const oocyte = mongoose.model('oocyte', oocyteSchema);

// Export the model
module.exports = oocyte;