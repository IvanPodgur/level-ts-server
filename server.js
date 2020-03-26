const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());

require("./startup/db")();
require("./startup/routes")(app);

app.get("/", (req, res) => {
  res.send("Hello Beautiful World!!!");
});

//comment before the first commit
app.listen(process.env.PORT || 4000, () => {
  if (process.env.PORT) {
    console.log("listening on PORT", process.env.PORT);
  } else {
    console.log("listening on PORT 4000");
  }
});
