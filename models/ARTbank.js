const mongoose = require('mongoose');

const artBankSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  directorName: {
    type: String,
    required: true,
  },
  aadharNumber: {
    type: String,
    required: true,
  },
  panNumber: {
    type: String,
    required: true,
  },
  registrationId: {
    type: String,
    unique: true,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  donorSemenPrice: {
    type: Number,
    required: true,
  },
  oocyteDonorPrice: {
    type: Number,
    required: true,
  },
  surrogateMotherPrice: {
    type: Number,
    required: true,
  },
  documents: {
    type: [String], // Array of strings to store multiple document file paths
    required: true, // Add validation if at least one document is required
  },
});

const ARTBank = mongoose.model('ARTBank', artBankSchema);

module.exports = ARTBank;
