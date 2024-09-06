const express = require('express');
const BC = require('../controllers/BankDetailsController'); // Adjust path

const router = express.Router();

router.post('/bank-details', BC.createBankDetails);
router.get('/bank-details/:userId',  BC.getBankDetails);
router.get('/bank-details/:id',  BC.getBankDetailsById);
router.put('/bank-details/:id',  BC.updateBankDetails);
router.delete('/bank-details/:id',  BC.deleteBankDetails);

module.exports = router;
