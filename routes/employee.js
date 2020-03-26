const express = require("express");
const { Employee } = require("../models/employee");
const { Timesheet } = require("../models/timesheet");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    console.log("Getting all empoyees");
    const employees = await Employee.find();
    res.send({ success: true, employees });
  } catch (err) {
    console.log(err);
    res.send({ success: false });
  }
});

router.get("/:employee", auth, async (req, res) => {
  console.log("Getting employee", req.user);
  try {
    const employee = await Employee.findById(req.params.employee);
    if (!employee) res.send({ success: false, error: "No such employee" });
    const allEmployeeTimesheets = await Timesheet.find({
      employee: req.params.employee
    });
    console.log("FOund timesheets", allEmployeeTimesheets);
    const employeeWithTimesheets = {
      ...employee,
      timesheets: allEmployeeTimesheets
    };
    res.send({ success: true, employee: employeeWithTimesheets });
  } catch (error) {
    console.log(error);
    res.send({ success: false, error });
  }
});

router.post("/add/new/:location", auth, async (req, res) => {
  const { firstName, secondName, email, address, hourlyRate } = req.body;
  console.log("PARAMS", req.params.location);

  try {
    const employee = new Employee({
      firstName,
      secondName,
      email,
      address,
      location: [req.params.location],
      createdBy: req.user._id,
      hourlyRate: hourlyRate
    });
    await employee.save();
    res.send({ success: true, employee: employee });
  } catch (err) {
    console.log(err);
    res.send({ success: false, error: err });
  }
});

router.get("/rota", async (req, res) => {
  console.log(
    "Get all employee for this location, with populated timesheets for this location and the given tim period"
  );
  console.log("Get employee, timesheets + salaryPayRule");
});

router.get("/location/:location", auth, async (req, res) => {
  console.log("LOCATION LOCATION !");
  const { employer } = req.user._id;
  const location = req.params.location;

  const employees = await Employee.find({
    employer: employer,
    location: location
  });
  if (!employees)
    return res.send({
      success: false,
      error: "error retrieving employee records"
    });

  res.send({ success: true, employees });
});

module.exports = router;
