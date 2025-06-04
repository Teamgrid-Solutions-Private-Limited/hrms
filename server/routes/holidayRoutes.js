const express = require("express");
const router = express.Router();
const holidayController = require("../controllers/holidayController");
const authJwt = require("../middlewares/authJwt");
const checkRole = require("../middlewares/checkRole");

// Get all holidays (accessible by all authenticated users)
router.get("/", authJwt(), holidayController.getHolidays);

// Create holiday (only super_admin)
router.post(
  "/",
  authJwt(),
  checkRole(["super_admin"]),
  holidayController.createHoliday
);

// Update holiday (only super_admin)
router.put(
  "/:holidayId",
  authJwt(),
  checkRole(["super_admin"]),
  holidayController.updateHoliday
);

// Delete holiday (only super_admin)
router.delete(
  "/:holidayId",
  authJwt(),
  checkRole(["super_admin"]),
  holidayController.deleteHoliday
);

module.exports = router; 