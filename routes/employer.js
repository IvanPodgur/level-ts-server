const express = require("express");
const bcrypt = require("bcrypt");
const { Employer } = require("../models/employer");
const { User } = require("../models/user");
const router = express.Router();

router.post("/login/", async (req, res) => {
  console.log("logging in with this details", req.body);
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });
  if (!user) return res.send({ success: false, error: "No such user" });
  console.log("Now comparing ", password);
  console.log("With ", user);
  const correctPassword = await bcrypt.compare(password, user.password);

  if (!correctPassword)
    return res.send({ success: false, error: "Wrong login details" });
  const token = user.generateAuthToken();
  return res.send({ success: true, token: token });
});

router.post("/", async (req, res) => {
  const employerDetails = {
    name: req.body.name,
    address: req.body.address
  };
  const newEmployer = await new Employer(employerDetails);
  if (!newEmployer)
    return res.send({
      success: false,
      error: "Error creating new Employer account"
    });

  const employer = await newEmployer.save();
  const password = await encryptPassword(req.body.adminPassword);
  console.log("PAssword encrypted ", password);
  const userDetails = {
    email: req.body.adminEmail,
    password: password,
    employer: employer._id,
    password: password
  };

  const adminUser = await new User(userDetails);
  if (!adminUser)
    return res.send({
      success: false,
      error: "Error creating new Employer account"
    });

  await adminUser.save();
  res.status(200).send({ success: true, user: adminUser });
});

router.get("/", async (req, res) => {
  console.log("Employer get route");
  res.status(200).send({ success: true });
});

encryptPassword = async password => {
  const salt = await bcrypt.genSalt(10);

  console.log("Salt", salt);
  console.log("Password", password);

  return await bcrypt.hash(password, salt);
};

module.exports = router;
