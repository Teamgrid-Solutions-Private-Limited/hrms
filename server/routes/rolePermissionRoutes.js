// routes/rolePermissionRoutes.js
const express = require("express");
const router = express.Router();
const rolePermissionController = require("../controllers/rolePermissionController");

router.post("/", rolePermissionController.assignPermissionToRole);
router.get("/", rolePermissionController.getRolePermissionsByRoleId);

//router.delete("/:id", rolePermissionController.removePermissionFromRole);

module.exports = router;
