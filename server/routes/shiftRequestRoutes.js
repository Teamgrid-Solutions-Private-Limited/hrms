const express = require('express');
const router = express.Router();
const SC  = require('../controllers/shiftrequestController');

// Route definitions
router.post('/shift/requests', SC.createShiftRequest);
router.get('/shift/requests', SC.getShiftRequests);
router.put('/shift/requests/:id', SC.updateShiftRequest);
router.delete('/shift/requests/:id', SC.deleteShiftRequest);
router.patch('/shift/requests/:id/status', SC.updateShiftRequestStatus);

module.exports = router;
