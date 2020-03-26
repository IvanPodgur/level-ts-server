// const users = require("../routes/user");
const timesheets = require("../routes/timesheet");
const employees = require("../routes/employee");
const employer = require("../routes/employer");
const location = require("../routes/location");

module.exports = function(app) {
  //   app.use("/api/users", users);
  app.use("/api/employee", employees);
  app.use("/api/employer", employer);
  app.use("/api/location", location);
  app.use("/api/timesheets", timesheets);
};
