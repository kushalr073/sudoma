const mongoose = require("mongoose");

const SurrogateSchema = new mongoose.Schema({
  donorName: {
    type: String,
    required: true,
  },
  aadharNumber: {
    type: String,
    required: true,
    unique: true,
  },
  
  source: {
    type: String,
    required: true,
    default: "ART Bank 1",
  },
  bloodGroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
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
      return this.weight / (this.height / 100) ** 2;
    },
  },

  issued: {
    type: Boolean,
    default: false,
  },
  issuedToRequest: {
    type: String,
    default: null,
  },
});

const Surrogate = mongoose.model("Surrogate", SurrogateSchema);

module.exports = Surrogate;
