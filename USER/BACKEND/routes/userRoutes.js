const express = require('express');
const router = express.Router();
const UserController = require('../Controllers/Auth/UserAuth');

// User signup
router.post('/signup', UserController.signup);

// User signin
router.post('/signin', UserController.signin);



module.exports = router;
