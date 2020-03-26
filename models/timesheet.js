const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TimesheetSchema = new Schema({
  employee: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    required: true
  },
  salaryPayRule: {
    type: Schema.Types.ObjectId,
    ref: "SalaryPayRule",
    required: false
  },
  hours: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: Date
  },
  finishTime: {
    type: Date
  },
  breakInMinutes: {
    type: Number,
    default: 0
  },
  location: {
    type: Schema.Types.ObjectId,
    ref: "Location",
    required: true
  },
  onHoliday: {
    type: Boolean,
    default: false
  },
  // timesheet: {
  //   type: Schema.Types.ObjectId,
  //   ref: "Timesheet",
  //   required: true
  // },
  totalCost: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
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

const Timesheet = mongoose.model("Timesheet", TimesheetSchema);
exports.TimesheetSchema = TimesheetSchema;
exports.Timesheet = Timesheet;
