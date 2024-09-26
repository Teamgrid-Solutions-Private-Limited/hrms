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
const worktyprequestRoute = require("./routes/workTypeRequesRoutes");
const shiftRequestRoute = require("./routes/shiftRequestRoutes");
const rotatingShiftRoute = require("./routes/rotatingShiftRoutes");

// const employeeRoute = require("./routes/employeeRoutes");
const employmentRoute = require("./routes/employmentRoutes");

const rolePermissionRoute = require("./routes/rolePermissionRoutes");

const worktypeAssignRoute = require("./routes/workTypeAssignmentRoutes");

const PORT = process.env.PORT || 6010;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("my-upload"));

app.get("/", (req, res) => {
  res.send("Welcome to the homepage!");
});

app.use("/roles", roleRoute);
app.use("/permissions", permissionRoute);
app.use("/role-permissions", rolePermissionRoute);
app.use("/api", userRoute);
app.use("/page-group", pageGroupRoute);
app.use("/pages", pagesRoute);
app.use("/pageelement", pageElemntRoute);
app.use("/api", documentRoute);
app.use("/api", professionalInfoRoute);
app.use("/api", userprofileroute);
app.use("/api", worktyprequestRoute);
app.use("/api", worktypeAssignRoute);
app.use("/api", shiftRequestRoute);
app.use("/api", rotatingShiftRoute);
app.use("/api", employmentRoute);

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
