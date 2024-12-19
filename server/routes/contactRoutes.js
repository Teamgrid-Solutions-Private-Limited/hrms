const { createContact, getContacts, getContactById, updateContact, deleteContact, getByuser }= require('../controllers/contactController');
const express = require('express');



const router = express.Router();

router.post('/contact/add',createContact );
router.get('/contact/view',getContacts);
router.get('/contact/viewById',getContactById);
// get contact by user ID
router.get('/contact/viewUserId/:id',getByuser);
router.put('/contact/update/:id',updateContact);
router.delete('/contact/delete/:id',deleteContact);

 module.exports= router;

