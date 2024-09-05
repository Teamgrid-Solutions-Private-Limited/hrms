const { createEmploymentInfo, getAllEmploymentInfos, getEmploymentInfoById, updateEmploymentInfo, deleteEmploymentInfo } = require('../controllers/employmentController');
const express = require('express');



const router = express.Router();

router.post('/employment/add',createEmploymentInfo);
router.get('/employment/view',getAllEmploymentInfos);
router.get('/employment/viewById',getEmploymentInfoById);
router.put('/employment/update/:id',updateEmploymentInfo);
router.delete('/employment/delete/:id',deleteEmploymentInfo);

 module.exports= router;

