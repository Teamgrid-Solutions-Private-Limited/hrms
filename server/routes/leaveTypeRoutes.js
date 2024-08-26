const express = require("express");
const { createLeaveType } = require("../controllers/leaveTypeController");

const router = express.Router();

router.post("/leave-type", createLeaveType);

module.exports = router;
