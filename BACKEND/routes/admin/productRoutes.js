const express = require('express');
const productController=require('../../controllers/admin/product/productcontoller');
const router = express.Router();
const upload = require('./multer'); 

router.post('/add', upload.fields([{ name: 'image' }, { name: 'image2' }]), productController.addProduct);

router.put('/update', upload.fields([{ name: 'image' }, { name: 'image2' }]), productController.updateProduct);

// Other routes
router.get('/', productController.getAllProducts);
router.post('/delete', productController.ProductStatus);

module.exports = router;
