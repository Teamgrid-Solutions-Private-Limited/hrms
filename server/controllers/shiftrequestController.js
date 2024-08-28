const Employee = require('../models/employeeSchema');
const ShiftRequest = require('../models/shiftRequestSchema');

class shiftrequestController {
    // Static method to check permissions based on employee role and action
    static checkPermissions = (userRole, action) => {
        const rolePermissions = {
            employee: ['view', 'create', 'update', 'delete'],
            manager: ['approve', 'reject', 'comment'],
            admin: ['approve', 'reject', 'update', 'delete']
        };
        return rolePermissions[userRole] && rolePermissions[userRole].includes(action);
    };

    // Create a new shift request
    static createShiftRequest = async (req, res) => {
        if (!shiftrequestController.checkPermissions(req.user.role, 'create')) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        try {
            const shiftRequest = new ShiftRequest({
                userId: req.body.userId,
                currentRequestType: req.body.currentRequestType,
                newRequestType: req.body.newRequestType,
                requestDate: req.body.requestDate,
                requestTillDate: req.body.requestTillDate,
                description: req.body.description
            });
            await shiftRequest.save();
            res.status(201).json(shiftRequest);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    // Get shift requests for a specific employee or all if the employee is an admin
    static getShiftRequests = async (req, res) => {
        if (!shiftrequestController.checkPermissions(req.user.role, 'view')) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        try {
            let shiftRequests;
            if (req.employee.role === 'admin') {
                shiftRequests = await ShiftRequest.find();
            } else {
                shiftRequests = await ShiftRequest.find({ employeeId: req.employee._id });
            }
            res.status(200).json(shiftRequests);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    // Update a shift request
    static updateShiftRequest = async (req, res) => {
        if (!shiftrequestController.checkPermissions(req.user.role, 'update')) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        try {
            const shiftRequest = await ShiftRequest.findById(req.params.id);
            if (!shiftRequest) {
                return res.status(404).json({ message: 'Shift Request not found' });
            }
            if (req.employee.role === 'employee' && shiftRequest.employeeId.toString() !== req.employee._id.toString()) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            shiftRequest.currentRequestType = req.body.currentRequestType || shiftRequest.currentRequestType;
            shiftRequest.newRequestType = req.body.newRequestType || shiftRequest.newRequestType;
            shiftRequest.requestDate = req.body.requestDate || shiftRequest.requestDate;
            shiftRequest.requestTillDate = req.body.requestTillDate || shiftRequest.requestTillDate;
            shiftRequest.description = req.body.description || shiftRequest.description;

            await shiftRequest.save();
            res.status(200).json(shiftRequest);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    // Delete a shift request
    static deleteShiftRequest = async (req, res) => {
        if (!shiftrequestController.checkPermissions(req.user.role, 'delete')) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        try {
            const shiftRequest = await ShiftRequest.findByIdAndDelete(req.params.id);
            if (!shiftRequest) {
                return res.status(404).json({ message: 'Shift Request not found' });
            }
            res.status(200).json({ message: 'Shift Request deleted successfully' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    // Approve or reject a shift request (Manager/Admin only)
    static updateShiftRequestStatus = async (req, res) => {
        if (!shiftrequestController.checkPermissions(req.user.role, 'approve') && !ShiftRequestController.checkPermissions(req.employee.role, 'reject')) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        try {
            const shiftRequest = await ShiftRequest.findById(req.params.id);
            if (!shiftRequest) {
                return res.status(404).json({ message: 'Shift Request not found' });
            }
            if (req.employee.role === 'employee') {
                return res.status(403).json({ message: 'Forbidden' });
            }

            if (req.body.status) {
                shiftRequest.status = req.body.status;
            }
            if (req.body.managerComments) {
                shiftRequest.managerComments = req.body.managerComments;
            }
            if (req.body.hrComments) {
                shiftRequest.hrComments = req.body.hrComments;
            }

            await shiftRequest.save();
            res.status(200).json(shiftRequest);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };
}

module.exports = shiftrequestController;
