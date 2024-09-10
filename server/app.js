require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("./db/conn");
const roleRoute = require("./routes/roleRoutes");

const userRoute = require("./routes/userRoutes");
const pageGroupRoute = require("./routes/pagesGroupRoutes");
const pagesRoute = require("./routes/pagesRoutes");
const pageElemntRoute = require("./routes/pagesElementRoutes");
const documentRoute = require("./routes/documentRoutes");
const userprofileroute = require("./routes/userProfileRoutes");
const permissionRoute = require("./routes/permissionRoutes");
const professionalInfoRoute = require("./routes/professionalinfoRoutes");
<<<<<<< HEAD
// const employeeRoute = require("./routes/employeeRoutes");
const employmentRoute = require("./routes/employmentRoutes");
=======
const rolePermissionRoute = require("./routes/rolePermissionRoutes");
>>>>>>> hrms-saruk

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

app.use("/api/roles", roleRoute);
app.use("/api/permissions", permissionRoute);
app.use("/api/role-permissions", rolePermissionRoute);
app.use("/api", userRoute);
app.use("/api", pageGroupRoute);
app.use("/api", pagesRoute);
app.use("/api", pageElemntRoute);
app.use("/api", documentRoute);
app.use("/api", professionalInfoRoute);
<<<<<<< HEAD
// app.use("/api", employeeRoute);
app.use("/api",employmentRoute);
=======
app.use("/api", userprofileroute);
>>>>>>> hrms-saruk

// Error-handling middleware (should be the last middleware)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Only start the server after a successful database connection
mongoose.connection.once("open", () => {
  app.listen(PORT, () => {
    console.log(`Server up and down ${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});
