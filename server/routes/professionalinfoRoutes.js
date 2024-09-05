const express = require("express");
const {
  addProfessionalInfo,
  getProfessionalInfo,
  getProfessionalInfoByid,
  updateProfessionalInfo,
  deleteProfessionalinfoController,
} = require("../controllers/professionsalinfoController");

const router = express.Router();

router.post("/addprofessional-info", addProfessionalInfo);
router.get("/viewprofessional-info", getProfessionalInfo);
router.get("/viewprofessional-info/:id", getProfessionalInfoByid);
router.put("/update-info/:id", updateProfessionalInfo);
router.delete("/deleteprofessional-info", deleteProfessionalinfoController);

module.exports = router;
