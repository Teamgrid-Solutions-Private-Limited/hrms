const express = require("express");
const {
  createRole,
  getRoles,
  getRolesByid,
} = require("../controllers/roleController");

const router = express.Router();

router.post("/roles", createRole);
router.get("/roles", getRoles);
router.get("/roles/:id", getRolesByid);

module.exports = router;
