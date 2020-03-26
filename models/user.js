const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String
  },
  secondName: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  accessLevel: {
    type: Number,
    required: true,
    default: 0
  },
  //add link to the employer model
  employer: {
    type: Schema.Types.ObjectId,
    ref: "Employer"
  }
});

userSchema.methods.comparePasswords = async function(password) {
  console.log("COMPARING passwords", password);
  console.log("WITH THIS ", this.password);
  const validationResult = await bcrypt.compare(password, this.password);
  return validationResult;
};

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      employer: this.employer,
      firstName: this.firstName,
      secondName: this.secondName,
      phoneNumber: this.phoneNumber
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);
exports.User = User;
