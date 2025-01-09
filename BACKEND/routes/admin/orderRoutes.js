const express = require('express');
const router = express.Router();


const orderController=require('../../controllers/admin/order/ordercontroller');
router.get('/orderforadmin', orderController.getAllOrdersForAdmin);
router.put('/updatestatus', orderController.updateOrderStatusByAdmin);
router.get('/ordersummary',orderController.getAllOrdersSummary);
module.exports = router;
