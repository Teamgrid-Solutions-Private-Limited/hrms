const express = require('express');
const BC = require('../controllers/bankdetailsController');  

const router = express.Router();

router.post('/bank-details',authJwt(),
checkRole(["admin", "super_admin", "hr"]), BC.createBankDetails);

router.get('/bank-details/:userId',authJwt(),
checkRole(["admin", "super_admin", "employee", "hr"]),  BC.getBankDetails);

router.get('/bank-details/:id', authJwt(),
checkRole(["admin", "super_admin", "finance"]),  BC.getBankDetailsById);
// get by user Id
router.get('/bank-detailsUser/:id', authJwt(),
checkRole(["admin", "super_admin", "finance"]),  BC.getBankUser);

router.put('/bank-details/:id',authJwt(),
checkRole(["admin", "super_admin"]),  BC.updateBankDetails);

router.delete('/bank-details/:id',   authJwt(),
checkRole(["super_admin"]),BC.deleteBankDetails);

module.exports = router;


