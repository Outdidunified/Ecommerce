const express = require('express');
const router = express.Router();
const ProductController=require('../../controllers/user/product/productcontroller');

router.get('/', ProductController.getAllProducts);
router.post('/subcategorylist', ProductController.getsubcateg);
router.post('/id', ProductController.getProducts);
router.get('/categoryname', ProductController.getcategory);
router.post('/search',ProductController.searchProducts);
module.exports = router; 