const express = require('express');
const router = express.Router();
const UserController=require('../../controllers/user/auth/usercontroller');
// User signup
router.post('/signup', UserController.signup);

// User signin
router.post('/signin', UserController.signin);
router.put('/update',UserController.update);

router.post('/forgotPassword',UserController.forgotPassword);
router.post('/resetpassword',UserController.resetPassword);
router.get('/getUserDetails/:user_id', UserController.getUserOrderAndDetails);
router.post('/otp',UserController.verifyOTP);
module.exports = router;