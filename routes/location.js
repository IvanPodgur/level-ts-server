const express = require("express");
const { Location } = require("../models/location");
const { Timesheet } = require("../models/timesheet");

const auth = require("../middleware/auth");
const { Employee } = require("../models/employee");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  console.log("Create location for an employer");
  console.log("User that sent the request is ", req.user);
  const { name, address } = req.body;
  const newLocation = {
    name: name,
    address: address,
    employer: req.user.employer
  };

  const locationObject = await new Location(newLocation);
  const location = await locationObject.save();
  if (!location)
    return res.send({
      success: false,
      error: "Error, trying to save new location"
    });

  return res.send({ success: true, location: location });
});

router.get("/all/", auth, async (req, res) => {
  console.log("Got all locations for this employer", req.user.employer);
  const locations = await Location.find({ employer: req.user.employer });
  if (!locations)
    return res.send({
      success: false,
      error: "Failed to retrieve the locations"
    });
  console.log("Found locations", locations);
  res.send({ success: true, locations });
});

router.get("/:location/rota", auth, async (req, res) => {
  console.log("LOCATION ROTA ONLY POST");

  var curr = new Date(); // get current date
  var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
  var last = first + 6; // last day is the first day + 6

  // var startDate = new Date(curr.setDate(first)).toUTCString();
  // var endDate = new Date(curr.setDate(last)).toUTCString();
  var startDate = getStartOfWeek(new Date());
  var endDate = getEndOfWeek(new Date());

  try {
    let employees = await Employee.find({ location: location }).populate({
      path: "timesheets",
      match: { date: { $gte: startDate, $lte: endDate } }
    });

    if (!employees)
      return res.send({
        success: false,
        error: "Failed to retrieve such employees"
      });

    return res.send({ success: true, employees });
  } catch (error) {
    console.log("ERROR ", error);
    return res.send({ success: false, error });
  }
});

router.post("/:location/rota", auth, async (req, res) => {
  console.log("LOCATION ROTA ONLY POST");

  const { location } = req.params;

  var curr = new Date(); // get current date
  var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
  var last = first + 6; // last day is the first day + 6

  var startDate = new Date(curr.setDate(first)).toUTCString();
  var endDate = new Date(curr.setDate(last)).toUTCString();

  try {
    let employeeRota = await Employee.find({ _id: req.body.employee }).populate(
      {
        path: "timesheets",
        match: { date: { $gte: startDate, $lte: endDate }, location: location }
      }
    );

    if (!employeeRota)
      return res.send({
        success: false,
        error: "Failed to retrieve such employeeRota"
      });

    return res.send({ success: true, employeeRota });
  } catch (error) {
    console.log("ERROR ", error);
    return res.send({ success: false, error });
  }
});

router.post("/:location/rota/week", auth, async (req, res) => {
  console.log("LOCATION ROTA WEEK");
  const { location } = req.params;

  var curr = req.body.date; // get current date
  var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
  var last = first + 6; // last day is the first day + 6

  // var startDate = new Date(curr.setDate(first)).toUTCString();
  // var endDate = new Date(curr.setDate(last)).toUTCString();
  var startDate = getStartOfWeek(new Date());
  var endDate = getEndOfWeek(new Date());

  try {
    let employeeRota = await Employee.find({
      employee: req.body.employee,
      date: { $gte: startDate, $lte: endDate },
      location: location
    });

    if (!employeeRota)
      return res.send({
        success: false,
        error: "Failed to retrieve such employeeRota"
      });

    return res.send({ success: true, employeeRota });
  } catch (error) {
    console.log("ERROR ", error);
    return res.send({ success: false, error });
  }
});

router.post("/rota/week", auth, async (req, res) => {
  const { location } = req.body;
  console.log("Getting rota for this location", location);
  console.log(req.body);
  const week = new Date(req.body.week);
  var startDate = getStartOfWeek(week);
  var endDate = getEndOfWeek(week);

  try {
    let weeksRota = await Employee.find({
      location: location
    }).populate({
      path: "timesheets",
      match: { date: { $gte: startDate, $lte: endDate } }
    });

    // let weeksRota = await Employee.find({
    //   location: location
    // }).populate({
    //   path: "timesheets"
    // });

    if (!weeksRota)
      return res.send({
        success: false,
        error: "Failed to retrieve such weeksRota"
      });

    return res.send({ success: true, weeksRota });
  } catch (error) {
    console.log("ERROR ", error);
    return res.send({ success: false, error });
  }
});

router.post("/rota/timesheet", auth, async (req, res) => {
  console.log("Updating timesheet by id");
  const {
    timesheetID,
    hours,
    totalCost,
    startTime,
    finishTime,
    onHoliday
  } = req.body;
  console.log(req.body);
  try {
    const newTimesheet = await Timesheet.findByIdAndUpdate(
      timesheetID,
      {
        hours: hours,
        totalCost: totalCost,
        startTime: startTime,
        finishTime: finishTime,
        onHoliday: onHoliday
      },
      { new: true }
    );
    if (!newTimesheet)
      return res.send({
        success: false,
        error: "Faild to update the timesheet hours"
      });

    return res.send({ success: true, timesheet: newTimesheet });
  } catch (error) {
    console.log("Error", error.type);
    return res.send({
      success: false,
      error
    });
  }
});

router.post("/rota/timesheet/new", auth, async (req, res) => {
  console.log("Creating new timesheet");
  console.log(req.body);
  const userId = req.user._id;
  const {
    hours,
    startTime,
    finishTime,
    location,
    date,
    employee,
    totalCost,
    onHoliday
  } = req.body;
  const newTimesheetObject = {
    hours: hours,
    startTime: startTime,
    finishTime: finishTime,
    createdBy: userId,
    location: location,
    date: date,
    employee: employee,
    totalCost: totalCost,
    onHoliday: onHoliday
  };

  try {
    const newTimesheet = await Timesheet.create(newTimesheetObject);

    if (!newTimesheet)
      return res.send({
        success: false,
        error: "Faild to update the timesheet hours"
      });

    await Employee.findOneAndUpdate(
      { _id: req.body.employee },
      { $push: { timesheets: newTimesheet._id } },
      { new: true }
    );

    return res.send({ success: true, timesheet: newTimesheet });
  } catch (error) {
    console.log(error);
    return res.send({
      success: false,
      error
    });
  }
});

getStartOfWeek = currentWeek => {
  let date = new Date(currentWeek);
  date.setDate(date.getDate() + ((1 - date.getDay()) % 7));
  date.setMinutes(1);
  date.setHours(0);
  return date;
};

getEndOfWeek = currentWeek => {
  let date = new Date(currentWeek);
  date.setDate(date.getDate() + ((7 - date.getDay()) % 7));
  date.setMinutes(59);
  date.setHours(23);
  return date;
};

// old function to retrive timesheets seperrately
getTimesheets = async (employee, date) => {
  let first = date.getDate() - date.getDay(); // First day is the day of the month - the day of the week
  let last = first + 6; // last day is the first day + 6

  let startDate = new Date(date.setDate(first)).toUTCString();
  let endDate = new Date(date.setDate(last)).toUTCString();

  const timesheets = await Timesheet.find({
    employee: employee,
    date: { $gt: startDate, $lt: endDate }
  });
  return timesheets;
};

module.exports = router;
