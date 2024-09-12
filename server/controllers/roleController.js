const Role = require("../models/roleSchema"); // Assuming this is the correct path for your Role model

<<<<<<< HEAD
class roleController{

  static createRole = async (req, res) => {
    try {
      const { name } = req.body;
      const role = new Role({ name });
      await role.save();
      res.status(201).json(role);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
  
  static getAllRoles = async (req, res) => {
    try {
      const roles = await Role.find();
      res.status(200).json(roles);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
  
  static getRoleById = async (req, res) => {
    try {
      const role = await Role.findById(req.params.id);
      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }
      res.status(200).json(role);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
  
  static updateRole = async (req, res) => {
    try {
      const { name } = req.body;
      const role = await Role.findByIdAndUpdate(
        req.params.id,
        { name },
        { new: true }
      );
      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }
      res.status(200).json(role);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
  
  static deleteRole = async (req, res) => {
    try {
      const role = await Role.findByIdAndDelete(req.params.id);
      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }
      res.status(200).json({ message: "Role deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
}

module.exports= roleController;
=======
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
>>>>>>> hrms-saruk
