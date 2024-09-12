const express = require("express");
const router = express.Router();
<<<<<<< HEAD

const jwtAuth = require("../middlewares/authJwt");
const checkRole = require("../middlewares/checkRole");
const {
  createWorkTypeRequest,
  getWorkTypeRequests,
  updateWorkTypeRequest,
  deleteWorkTypeRequest,
  updateWorkTypeRequestStatus,
} = require("../controllers/workTypeRequestControler");
=======
const WorkTypeRequestController = require('../controllers/workTypeRequestControler');
const jwtAuth = require('../middlewares/authJwt');  
const checkRole = require('../middlewares/checkRole');  
>>>>>>> hrms-tanvir

// Apply JWT authentication middleware to all routes
router.use(jwtAuth);

router.post("/work-type/requests", checkRole("create"), createWorkTypeRequest);
router.get("/work-type/requests", checkRole("view"), getWorkTypeRequests);
router.put(
  "/work-type/requests/:id",
  checkRole("update"),
  updateWorkTypeRequest
);
router.delete(
  "/work-type/requests/:id",
  checkRole("delete"),
  deleteWorkTypeRequest
);
router.patch(
  "/work-type/requests/:id/status",
  checkRole("approve"),
  updateWorkTypeRequestStatus
);

module.exports = router;
