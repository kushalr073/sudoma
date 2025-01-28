const mongoose = require('mongoose');

// Define the schema
const surrogacySchema = new mongoose.Schema({
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
    type: Number,
    default: function () {
      return this.weight / ((this.height / 100) ** 2);
    },
  },
  artBank: {
    type:String,
    required: true,
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
const surrogacy = mongoose.model('surrogancy',surrogacySchema);
module.exports=surrogacy;