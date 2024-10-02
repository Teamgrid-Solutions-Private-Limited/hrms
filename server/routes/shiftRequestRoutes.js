const express = require("express");
const router = express.Router();
const SC = require("../controllers/shiftrequestController");
const authMiddleware = require('../middlewares/authJwt');
 
// Apply JWT authentication middleware to all routes

router.post("/shift/requests",authMiddleware("create"), SC.createShiftRequest);
router.get("/shift/requests",authMiddleware("view"), SC.getShiftRequests);
router.put("/shift/requests/:id",authMiddleware("update"), SC.updateShiftRequest);
router.delete(
  "/shift/requests/:id",
  authMiddleware("delete"),
  SC.deleteShiftRequest
);
router.patch(
  "/shift/requests/:id/status",
  authMiddleware("approve"),
  SC.updateShiftRequestStatus
);

module.exports = router;
