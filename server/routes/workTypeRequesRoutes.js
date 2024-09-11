const express = require('express');
const router = express.Router();
const WorkTypeRequestController = require('../controllers/workTypeRequestController');
const jwtAuth = require('../middlewares/authJwt');  
const checkRole = require('../middlewares/checkRole');  

// Apply JWT authentication middleware to all routes
router.use(jwtAuth);

// Define routes with appropriate role checks
router.post('/work-type/requests', checkRole('create'), WorkTypeRequestController.createWorkTypeRequest);
router.get('/work-type/requests', checkRole('view'), WorkTypeRequestController.getWorkTypeRequests);
router.put('/work-type/requests/:id', checkRole('update'), WorkTypeRequestController.updateWorkTypeRequest);
router.delete('/work-type/requests/:id', checkRole('delete'), WorkTypeRequestController.deleteWorkTypeRequest);
router.patch('/work-type/requests/:id/status', checkRole('approve'), WorkTypeRequestController.updateWorkTypeRequestStatus);

module.exports = router;
