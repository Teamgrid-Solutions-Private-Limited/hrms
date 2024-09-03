require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("./db/conn");
const roleRoute = require("./routes/roleRoutes");
const organizatioRoute = require("./routes/organizationRoutes");
const userRoute = require("./routes/userRoutes");
const pageGroupRoute = require("./routes/pagesGroupRoutes");
const pagesRoute = require("./routes/pagesRoutes");
const pageElemntRoute = require("./routes/pagesElementRoutes");
const employeeRoute = require("./routes/employeeRoutes");

// const leavetypeRoute = require("./routes/leaveTypeRoutes");
// const workAssignRoute = require("./routes/workTypeAssignmentRoutes");
// const shiftRequestRoute = require("./routes/shiftRequestRoutes");

const PORT = process.env.PORT || 6010;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("my-upload"));

app.get("/", (req, res) => {
  res.send("Welcome to the homepage!");
});

app.use("/api", roleRoute);
app.use("/api", organizatioRoute);
app.use("/api", userRoute);
app.use("/api", pageGroupRoute);
app.use("/api", pagesRoute);
app.use("/api", pageElemntRoute);
app.use("/api", employeeRoute);

// app.use("/api", leavetypeRoute);
// app.use("/api", workAssignRoute);
// app.use("/shift", shiftRequestRoute);

// Error-handling middleware (should be the last middleware)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Only start the server after a successful database connection
mongoose.connection.once("open", () => {
  app.listen(PORT, () => {
    console.log(`Server has started at port ${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});
