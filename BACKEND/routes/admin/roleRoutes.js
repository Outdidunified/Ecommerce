const express = require('express');
const router = express.Router();


const RoleController=require('../../controllers/admin/role/rolecontroller');

router.post('/add', RoleController.addRole);
router.get('/',RoleController.getAllRoles)
router.post('/update',RoleController.updateRoleName);
router.post('/delete',RoleController.deactivateProduct);
module.exports = router;


