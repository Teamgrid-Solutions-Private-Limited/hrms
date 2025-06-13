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

router.get("/document/:userId/:leaveId/:fileName",
  authJwt(),
  checkRole(["super_admin", "admin","employee"]),
  LeaveController.serveLeaveDocument
);


router.put("/leaves/:leaveId/approve",authJwt(),
 checkRole(["super_admin", "admin","employee"]), LeaveController.approveLeaveRequest);
router.get(
  "/leave/viewall",
  authJwt(),
  checkRole(["super_admin", "admin","employee"]),
  LeaveController.viewLeave
);
router.put("/leaves/:leaveId/reject",authJwt(),
checkRole(["super_admin", "admin","employee"]), LeaveController.rejectLeaveRequest);
router.put("/leaves/:leaveId/update",authJwt(),checkRole(["employee", "admin","hr"]), LeaveController.updateLeave);
router.get("/leaves/view/:userId",authJwt(),
checkRole(["super_admin", "admin","employee"]), LeaveController.getLeaveByUserId);



router.delete(
  "/leaves/:leaveId",
  authJwt(),
  checkRole(["super_admin", "admin", "employee"]), 
  LeaveController.deleteLeave
);


module.exports = router;
