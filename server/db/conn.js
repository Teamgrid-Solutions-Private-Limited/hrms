// const mongoose = require("mongoose");

// // Connection URI
// const uri = process.env.MONGODB_URI;

// const DB = mongoose.connect(uri);
// DB.then(() => {
//   console.log("Database successfully connected");
// }).catch((err) => {
//   console.log(err);
// });

// module.exports = DB;

const mongoose = require("mongoose");

// Connection URI
const uri = process.env.MONGODB_URI;

mongoose
  .connect(uri)
  .then(() => {
    console.log("Database successfully connected");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1); // Exit the process with a failure code
  });

module.exports = mongoose;
