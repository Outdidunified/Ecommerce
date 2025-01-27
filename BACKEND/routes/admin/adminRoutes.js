const express = require('express');
const router = express.Router();

const AdminController=require('../../controllers/admin/admincontroller/admincontroller');
router.post('/signup', AdminController.signup);
router.post('/signin', AdminController.signin);
router.put('/settings',AdminController.updateSettings)
router.get('/',AdminController.getUserDetails);
router.post('/addUser',AdminController.addUser);
router.put('/updateuser',AdminController.updateUser);
router.post('/deleteuser',AdminController.deactivateUser)
router.get('/getalluser',AdminController.getAllUsers);
router.post('/get',AdminController.getUserDetails);
module.exports = router;