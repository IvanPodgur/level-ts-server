const mongoose = require("mongoose");
const Employee = require("./employee.js");
const Schema = mongoose.Schema;

const salaryPayRuleSchema = new Schema({
  payRuleId: {
    type: Number,
    required: true,
    unique: true
  },
  hourlyPay: {
    type: Number,
    required: true,
    default: 0
  },
  salary: {
    type: Number,
    required: true,
    default: 0
  }
});

const SalaryPayRule = mongoose.model("SalaryPayRule", salaryPayRuleSchema);

exports.SalaryPayRule = SalaryPayRule;
