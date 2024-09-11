const Role = require("../models/roleSchema"); // Assuming this is the correct path for your Role model

// Create a new role
const createRole = async (req, res, next) => {
  try {
    const { name, permissionsId, pageAccessId } = req.body;

    // Create the new role
    const newRole = new Role({
      name,
      permissionsId,
      pageAccessId,
    });

    const savedRole = await newRole.save();
    res.status(201).json(savedRole);
  } catch (error) {
    next(error);
  }
};

// Get all roles
const getAllRoles = async (req, res, next) => {
  try {
    const roles = await Role.find()
      .populate("permissionsId")
      .populate("pageAccessId");

    res.json(roles);
  } catch (error) {
    next();
  }
};

// Get role by ID
const getRoleById = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id)
      .populate("permissionsId")
      .populate("pageAccessId")
      .populate("elementAccessId");
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    res.json(role);
  } catch (error) {
    next();
  }
};

// Update role by ID
const updateRole = async (req, res, next) => {
  try {
    const { name, permissionsId, pageAccessId, elementAccessId } = req.body;

    const updatedRole = await Role.findByIdAndUpdate(
      req.params.id,
      { name, permissionsId, pageAccessId, elementAccessId },
      { new: true }
    )
      .populate("permissionsId")
      .populate("pageAccessId")
      .populate("elementAccessId");

    if (!updatedRole) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.json(updatedRole);
  } catch (error) {
    next();
  }
};

// Delete role by ID
const deleteRole = async (req, res, next) => {
  try {
    const deletedRole = await Role.findByIdAndDelete(req.params.id);
    if (!deletedRole) {
      return res.status(404).json({ message: "Role not found" });
    }
    res.json({ message: "Role deleted successfully" });
  } catch (error) {
    next();
  }
};

module.exports = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
};
