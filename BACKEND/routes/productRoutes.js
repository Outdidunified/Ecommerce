const express = require('express');
const productController = require('../controllers/product/productcontroller');
const router = express.Router();
const upload=require('./multer')

// Route for adding a product

router.post('/add', productController.addProduct);

// Other routes
router.get('/', productController.getAllProducts);
router.put('/update', productController.updateProduct);
//router.post('/delete', productController.deactivateProduct);
router.post('/delete', productController.ProductStatus);
module.exports = router;
 