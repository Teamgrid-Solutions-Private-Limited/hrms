const express = require("express");
const router = express.Router();

 
const {
  createWorkTypeRequest,
  getWorkTypeRequests,
  updateWorkTypeRequest,
  deleteWorkTypeRequest,
  updateWorkTypeRequestStatus,
} = require("../controllers/workTypeRequestControler");
 
const authMiddleware = require('../middlewares/authJwt');

router.post("/work-type/requests",authMiddleware("create"), createWorkTypeRequest);
router.get("/work-type/requests",authMiddleware("view"), getWorkTypeRequests);
router.put(
  "/work-type/requests/:id",
  authMiddleware("update"),
  updateWorkTypeRequest
);
router.delete(
  "/work-type/requests/:id",
  authMiddleware("delete"),
  deleteWorkTypeRequest
);
router.patch(
  "/work-type/requests/:id/status",
  authMiddleware("approve"),
  updateWorkTypeRequestStatus
);

module.exports = router;
