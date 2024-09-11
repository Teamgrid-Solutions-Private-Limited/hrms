// routes/rolePermissionRoutes.js
const express = require("express");
const router = express.Router();
const rolePermissionController = require("../controllers/rolePermissionController");

router.post("/", rolePermissionController.assignPermission);
router.get("/", rolePermissionController.getPermissionsByRole);

//router.delete("/:id", rolePermissionController.removePermissionFromRole);

module.exports = router;
