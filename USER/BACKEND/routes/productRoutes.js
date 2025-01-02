const express = require('express');
const router = express.Router();
const ProductController = require('../Controllers/products/productundercategory');

router.get('/', ProductController.getCategoryHierarchy);


module.exports = router; // Correct export
