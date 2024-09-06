const { createContact, getContacts, getContactById, updateContact, deleteContact }= require('../controllers/contactController');
const express = require('express');



const router = express.Router();

router.post('/contact/add',createContact );
router.get('/contact/view',getContacts);
router.get('/contact/viewById',getContactById);
router.put('/contact/update/:id',updateContact);
router.delete('/contact/delete/:id',deleteContact);

 module.exports= router;

