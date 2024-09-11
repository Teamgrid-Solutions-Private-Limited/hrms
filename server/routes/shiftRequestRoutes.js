const express = require('express');
const router = express.Router();
const SC = require('../controllers/shiftrequestController');
const jwtAuth = require('../middlewares/authJwt');  
const checkRole = require('../middlewares/checkRole');  

// Apply JWT authentication middleware to all routes
router.use(jwtAuth);

 
router.post('/shift/requests', checkRole('create'), SC.createShiftRequest);  
router.get('/shift/requests', checkRole('view'), SC.getShiftRequests);  
router.put('/shift/requests/:id', checkRole('update'), SC.updateShiftRequest);  
router.delete('/shift/requests/:id', checkRole('delete'), SC.deleteShiftRequest);  
router.patch('/shift/requests/:id/status', checkRole('approve'), SC.updateShiftRequestStatus);  

module.exports = router;
