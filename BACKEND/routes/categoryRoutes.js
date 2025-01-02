const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category/categorycontroller');  // Correct relative path

// Route to add a new category (POST)
router.post('/add', categoryController.addCategory);
router.post('/add-subcategory', categoryController.addSubCategory);
router.get('/getAllCategories', categoryController.getAllCategories);
router.put('/updatecategory', categoryController.updateCategory); 
router.get('/getCategories', categoryController.getsubCategories);
router.get('/getAllSubCategories',categoryController.getAllSubCategories);
router.put('/updatesubcategory', categoryController.updateSubCategory);
router.post('/deletecategory', categoryController.deleteCategory);
router.post('/deletesubcategory', categoryController.deleteSubCategory);
router.get('/categoryname', categoryController.getcategory);
router.post('/subcategorylist', categoryController.getsubcateg);
router.post('/getProducts', categoryController.getProducts);

//router.get('/categoryname', categoryController.getcategory);
//router.get('/productundercategory', categoryController.getCategoryHierarchy);

module.exports = router;
