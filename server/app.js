require("dotenv").config();
const db = require("./db/conn");

const express = require("express");
const cors = require("cors");

const PORT = process.env.PORT || 6010;
const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to the homepage!");
});

app.listen(PORT, () => {
  console.log(`server has started at port ${PORT}`);
});
