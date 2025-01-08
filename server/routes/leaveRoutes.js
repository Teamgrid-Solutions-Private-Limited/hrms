const express = require("express");
const router = express.Router();
const LeaveController = require("../controllers/leaveController");
// const authMiddleware = require("../middlewares/authJwt");
const authJwt = require("../middlewares/authJwt");
const checkRole = require("../middlewares/checkRole");
const upload = require("../middlewares/fileUpload");

// Routes
router.post("/leaves",authJwt(),
checkRole(["super_admin", "admin","employee"]),upload.single("supportingDocument"),LeaveController.createLeaveRequest);
router.put("/leaves/:leaveId/approve",authJwt(),
checkRole(["super_admin", "admin"]), LeaveController.approveLeaveRequest);
router.get(
  "/leave/viewall",
  authJwt(),
  checkRole(["super_admin", "admin","employee"]),
  LeaveController.viewLeave
);
router.put("/leaves/:leaveId/reject",authJwt(),
checkRole(["super_admin", "admin"]), LeaveController.rejectLeaveRequest);
router.get("/leaves/view/:userId",authJwt(),
checkRole(["super_admin", "admin","employee"]), LeaveController.getLeaveByUserId);

module.exports = router;
