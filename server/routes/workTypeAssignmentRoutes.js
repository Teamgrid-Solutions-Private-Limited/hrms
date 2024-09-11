const express = require('express');
const router = express.Router();
const WorkTypeAssignmentController = require('../controllers/workTypeAssignmentController');
const jwtAuth = require('../middlewares/authJwt');  
const checkRole = require('../middlewares/checkRole');  

// Apply JWT authentication middleware to all routes
router.use(jwtAuth);

 
router.post('/work-type/assignments', checkRole('create'), WorkTypeAssignmentController.createWorkTypeAssignment);
router.get('/work-type/assignments', checkRole('view'), WorkTypeAssignmentController.getWorkTypeAssignments);
router.get('/work-type/assignments/:id', checkRole('view'), WorkTypeAssignmentController.getWorkTypeAssignmentById);
router.put('/work-type/assignments/:id', checkRole('update'), WorkTypeAssignmentController.updateWorkTypeAssignment);
router.delete('/work-type/assignments/:id', checkRole('delete'), WorkTypeAssignmentController.deleteWorkTypeAssignment);

module.exports = router;
