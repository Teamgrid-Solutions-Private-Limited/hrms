const WorkTypeRequest = require('../models/workTypeRequestSchema');

class WorkTypeRequestController {
    // Create a new work type request
    static createWorkTypeRequest = async (req, res) => {
        try {
            const workTypeRequest = new WorkTypeRequest({
                userId: req.body.userId,
                currentWorkType: req.body.currentWorkType,
                newWorkType: req.body.newWorkType,
                requestDate: req.body.requestDate,
                requestTillDate: req.body.requestTillDate,
                description: req.body.description
            });
            await workTypeRequest.save();
            res.status(201).json(workTypeRequest);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    // Get work type requests for a specific employee or all if the user is an admin
    static getWorkTypeRequests = async (req, res) => {
        try {
            let workTypeRequests;
            if (req.user.role === 'admin') {
                workTypeRequests = await WorkTypeRequest.find();
            } else {
                workTypeRequests = await WorkTypeRequest.find({ employeeId: req.user._id });
            }
            res.status(200).json(workTypeRequests);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    // Update a work type request
    static updateWorkTypeRequest = async (req, res) => {
        try {
            const workTypeRequest = await WorkTypeRequest.findById(req.params.id);
            if (!workTypeRequest) {
                return res.status(404).json({ message: 'Work Type Request not found' });
            }
            // Ensure the user is authorized to update this request
            if (req.user.role === 'employee' && workTypeRequest.employeeId.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            workTypeRequest.currentWorkType = req.body.currentWorkType || workTypeRequest.currentWorkType;
            workTypeRequest.newWorkType = req.body.newWorkType || workTypeRequest.newWorkType;
            workTypeRequest.requestDate = req.body.requestDate || workTypeRequest.requestDate;
            workTypeRequest.requestTillDate = req.body.requestTillDate || workTypeRequest.requestTillDate;
            workTypeRequest.description = req.body.description || workTypeRequest.description;

            await workTypeRequest.save();
            res.status(200).json(workTypeRequest);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    // Delete a work type request
    static deleteWorkTypeRequest = async (req, res) => {
        try {
            const workTypeRequest = await WorkTypeRequest.findByIdAndDelete(req.params.id);
            if (!workTypeRequest) {
                return res.status(404).json({ message: 'Work Type Request not found' });
            }
            res.status(200).json({ message: 'Work Type Request deleted successfully' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    // Approve or reject a work type request (Manager/Admin only)
    static updateWorkTypeRequestStatus = async (req, res) => {
        try {
            const workTypeRequest = await WorkTypeRequest.findById(req.params.id);
            if (!workTypeRequest) {
                return res.status(404).json({ message: 'Work Type Request not found' });
            }
            if (req.user.role === 'employee') {
                return res.status(403).json({ message: 'Forbidden' });
            }

            if (req.body.status) {
                workTypeRequest.status = req.body.status;
            }
            if (req.body.managerComments) {
                workTypeRequest.managerComments = req.body.managerComments;
            }
            if (req.body.hrComments) {
                workTypeRequest.hrComments = req.body.hrComments;
            }

            await workTypeRequest.save();
            res.status(200).json(workTypeRequest);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };
}

module.exports = WorkTypeRequestController;
