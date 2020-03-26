const express = require("express");
const { Timesheet } = require("../models/timesheet");
const { Employee } = require("../models/employee");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  console.log("Creating a timesheet ", req.body);
  const newTimesheetObject = {
    salaryPayRule: mongoose.Types.ObjectId("5e6baf5a15a6716e73971c8b"),
    totalCost: req.body.totalCost,
    hours: req.body.hours,
    date: req.body.date,
    createdBy: req.user._id,
    employee: req.body.employee,
    location: mongoose.Types.ObjectId("5e6baf5a15a6716e73971c8b")
  };
  try {
    const newTimesheet = await new Timesheet(newTimesheetObject);
    const savedTimesheet = await newTimesheet.save();
    if (!savedTimesheet)
      res.send({ success: false, error: "Faild to save the timesheet" });

    await Employee.findOneAndUpdate(
      { _id: req.body.employee },
      { $push: { timesheets: savedTimesheet._id } },
      { new: true }
    );

    res.send({ success: true, timesheet: savedTimesheet });
  } catch (error) {
    res.send({ success: false, error: error });
  }
});

router.get("/all", async (req, res) => {
  console.log("Getting all timesheets for the employee");
});

module.exports = router;
