const express = require("express");
 
 
const PORT = process.env.PORT || 6010;
const app = express();

 

app.get("/", (req, res) => {
  res.send("Welcome to the homepage!");
});

app.listen(PORT, () => {
  console.log(`server has started at port ${PORT}`);
});