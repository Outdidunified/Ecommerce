const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin/admincontroller');

// User signup
router.post('/signup', adminController.signup);

// User signin
router.post('/signin', adminController.signin);



module.exports = router;
