const express = require('express');
const router = express.Router();
const { addOrgainzation }= require('../controller/organizationController');


router.post('/organization/create',addOrgainzation);


module.exports=router;