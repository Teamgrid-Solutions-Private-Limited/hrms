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
const authRoute = require("./routes/authroutes");
const documentTemplateRoute = require("./routes/documentTemplateRoute");
const documentSubmissionRoute = require("./routes/documentSubmissionRoute");
const documentRequestRoute = require("./routes/documentRRoute");
const documentCategoryRoute = require("./routes/documentcRoute");
// const employeeRoute = require("./routes/employeeRoutes");
const employmentRoute = require("./routes/employmentRoutes");
const organizationRoute = require("./routes/organizationRoutes");
const emailRoute = require("./routes/emailRoutes");
const rolePermissionRoute = require("./routes/rolePermissionRoutes");

const worktypeAssignRoute = require("./routes/workTypeAssignmentRoutes");

const PORT = process.env.PORT || 6010;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("my-upload"));

app.use("/auth", authRoute);
app.use("/roles", roleRoute);
app.use("/permissions", permissionRoute);
app.use("/role-permissions", rolePermissionRoute);
app.use("/user", userRoute);
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
app.use("/documents/v1", documentCategoryRoute);
app.use("/documents/v1", documentRequestRoute);
app.use("/documentsubmission/v1", documentSubmissionRoute);
app.use("/documents/v1", documentRoute);
app.use("/documents-template/v1", documentTemplateRoute);
app.use("/organization",organizationRoute);
app.use("/email",emailRoute);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

mongoose.connection.once("open", () => {
  app.listen(PORT, () => {
    console.log(`Server up and down ${PORT}`);
  });
});
