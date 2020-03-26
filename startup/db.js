const mongoose = require("mongoose");

// const mongoUri =
//   "mongodb+srv://whale:hirewhale1@cluster0-vy2vs.mongodb.net/level?retryWrites=true";
const mongoUri = "mongodb://localhost:27017/leveltimesheet";

console.log("here we have the DB", process.env.DB);

module.exports = function() {
  mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  });

  mongoose.connection.on("connected", () => {
    console.log("Connected to mongo instance");
  });

  mongoose.connection.on("error", err => {
    console.log("Error connecting to mongo");
  });
};
