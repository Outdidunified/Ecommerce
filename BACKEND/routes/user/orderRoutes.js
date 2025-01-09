const express = require('express');
const router = express.Router(); // Middleware to verify JWT
const OrderController=require('../../controllers/user/order/ordercontroller');
const authenticate=require('../../middleware/auth');


router.post('/placeorderfromcart',authenticate,OrderController.placeorderfromcart);
router.post('/buynow',authenticate,OrderController.buynow);
router.post('/paymentsuccess',authenticate,OrderController.paymentsuccess);
router.post('/paymentfailure',authenticate,OrderController.failure);
//router.post('/address',authenticate,OrderController.addelivery);
router.get('/myorders',authenticate,OrderController.getOrderDetailsForUser);
//router.get('/ordersforadmin',authenticate,OrderController.getAllOrdersForAdmin);
//router.get('/ordercount/:user_id', OrderController.getUserOrderSummary);

module.exports = router;
