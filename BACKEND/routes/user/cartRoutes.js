const express = require('express');
const router = express.Router();
const CartController=require('../../controllers/user/cart/cartcontroller');
const authenticate=require('../../middleware/auth');// Middleware to verify JWT

// Apply authentication middleware
router.post('/addtocart', authenticate, CartController.addtocart);
router.get('/getcart', authenticate, CartController.getcart);
router.put('/updatecart', authenticate, CartController.updatecart);
router.delete('/removefromcart', authenticate, CartController.removefromcart);
module.exports = router;
