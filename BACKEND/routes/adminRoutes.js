const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin/admincontroller');
//const fetch = require('node-fetch');

// Admin signup
router.post('/signup', adminController.signup);

// Admin signin
router.post('/signin', adminController.signin);

// Update admin settings (username and/or password)
router.put('/settings', adminController.updateSettings);
router.post('/get', adminController.getUserDetails);
router.post('/adduser', adminController.addUser);
router.post('/deleteuser', adminController.deactivateUser);
router.put('/updateuser', adminController.updateUser);
router.get('/getalluser', adminController.getAllUsers);

module.exports = router;
