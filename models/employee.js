const mongoose = require("mongoose");
const User = require("./user");
const { TimesheetSchema } = require("./timesheet");
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  secondName: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  tags: {
    type: Array,
    default: []
  },
  phoneNumber: {
    type: String
  },
  role: {
    type: String
  },
  hourlyRate: {
    type: Number,
    required: true
  },
  timesheets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Timesheet"
    }
  ],
  //employee can have multiple locations
  location: {
    type: Array
  },

  active: {
    type: Boolean,
    default: true,
    required: true
  },
  createdBy: {
    type: User,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
});

const Employee = mongoose.model("Employee", employeeSchema);

exports.Employee = Employee;
