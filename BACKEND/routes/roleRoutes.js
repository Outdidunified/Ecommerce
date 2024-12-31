const express = require('express');
const role_Controller = require('../controllers/roles/role_controller');
const router = express.Router();

// Route for adding a role
router.post('/add', role_Controller.addRole);

// Route for getting all roles
router.get('/', role_Controller.getAllRoles);

// Route for updating role_name
router.post('/update', role_Controller.updateRoleName);

// Route for deactivating a role
router.post('/delete', role_Controller.deactivateProduct);

module.exports = router;
