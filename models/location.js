const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const locationSchema = new Schema({
  //Add link to the user table
  employer: {
    type: Schema.Types.ObjectId,
    ref: "Employer"
  },
  name: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  phone: {
    type: String
  }
});

const Location = mongoose.model("Location", locationSchema);

exports.Location = Location;
