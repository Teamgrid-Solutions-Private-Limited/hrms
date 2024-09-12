const express = require('express');
const router = express.Router();
const RotatingShiftAssignController = require('../controllers/rotatingShiftAssignController');
const jwtAuth = require('../middlewares/authJwt');  
const checkRole = require('../middlewares/checkRole');  

// Apply JWT authentication middleware to all routes
router.use(jwtAuth);

 
router.post('/rotating-shift-assigns', checkRole('create'), RotatingShiftAssignController.createRotatingShiftAssign);
router.get('/rotating-shift-assigns', checkRole('view'), RotatingShiftAssignController.getRotatingShiftAssigns);
router.get('/rotating-shift-assigns/:id', checkRole('view'), RotatingShiftAssignController.getRotatingShiftAssignById);
router.put('/rotating-shift-assigns/:id', checkRole('update'), RotatingShiftAssignController.updateRotatingShiftAssign);
router.delete('/rotating-shift-assigns/:id', checkRole('delete'), RotatingShiftAssignController.deleteRotatingShiftAssign);

module.exports = router;
