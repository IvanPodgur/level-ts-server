const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employerSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  }
});

const Employer = mongoose.model("Employer", employerSchema);
exports.Employer = Employer;
