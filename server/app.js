require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("./db/conn"); // Import mongoose instance
const roleRoutes = require("./routes/roleRoute");
const organizatioRoute = require("./routes/organizationRoutes");
const leavetypeRoute = require("./routes/leaveTypeRoutes");

const PORT = process.env.PORT || 6010;
const app = express();

app.use(cors());
app.use(express.json()); // To parse JSON request bodies

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to the homepage!");
});

app.use("/api", roleRoutes);
app.use("/api", organizatioRoute);
app.use("/api", leavetypeRoute);

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
