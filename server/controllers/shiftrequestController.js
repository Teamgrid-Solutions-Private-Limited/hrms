const ShiftRequest = require('../models/shiftRequestSchema');

class ShiftRequestController {
    // Create a new shift request
    static createShiftRequest = async (req, res) => {
        try {
            // Create shift request
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

    // Get shift requests
    static getShiftRequests = async (req, res) => {
        try {
            let shiftRequests;
            if (req.user.role === 'admin') {
                shiftRequests = await ShiftRequest.find();
            } else {
                shiftRequests = await ShiftRequest.find({ userId: req.user._id });
            }
            res.status(200).json(shiftRequests);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    // Update a shift request
    static updateShiftRequest = async (req, res) => {
        try {
            const shiftRequest = await ShiftRequest.findById(req.params.id);
            if (!shiftRequest) {
                return res.status(404).json({ message: 'Shift Request not found' });
            }

            // Ensure the user is authorized to update this request
            if (req.user.role === 'employee' && shiftRequest.userId.toString() !== req.user._id.toString()) {
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
        try {
            const shiftRequest = await ShiftRequest.findById(req.params.id);
            if (!shiftRequest) {
                return res.status(404).json({ message: 'Shift Request not found' });
            }
            if (req.user.role === 'employee') {
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

module.exports = ShiftRequestController;
