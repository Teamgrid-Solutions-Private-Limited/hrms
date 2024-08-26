const Role = require("../models/roleSchema"); // Import the Role model

class RoleController {
  // Method to create a new role
  async createRole(req, res, next) {
    try {
      const { name, permissions } = req.body;

      // Validate request body
      if (!name || !permissions || permissions.length === 0) {
        return res.status(400).json({
          message: "Role name and permissions are required",
        });
      }

      // Create a new role instance
      const newRole = new Role({
        name,
        permissions,
      });

      // Save the role to the database
      await newRole.save();

      // Respond with success message
      res.status(201).json({
        message: "Role created successfully",
        role: newRole,
      });
    } catch (error) {
      // Pass any errors to the error-handling middleware
      next(error);
    }
  }

  //Method for get Roles ----------
  async getRoles(req, res, next) {
    try {
      const roles = await Role.find();
      // Respond with success message
      res.status(201).json({
        message: "Role retrieved successfully",
        role: roles,
      });
    } catch (error) {
      // Pass any errors to the error-handling middleware
      next(error);
    }
  }

  //get by id

  async getRolesByid(req, res, next) {
    try {
      const roles = await Role.findById({ _id: req.params.id });
      // Respond with success message
      res.status(201).json({
        message: "Role retrieved successfully",
        role: roles,
      });
    } catch (error) {
      // Pass any errors to the error-handling middleware
      next(error);
    }
  }
}

module.exports = new RoleController(); // Export an instance of RoleController
