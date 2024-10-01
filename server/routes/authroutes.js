const express = require('express');
const { signUp, addOrganization }=require('../controllers/authController');
const router = express.Router();

router.post('/add',signUp);
router.post('/addOrganization',addOrganization);

module.exports=router;