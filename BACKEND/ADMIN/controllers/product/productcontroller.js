
//const db=require('../admin/config/db');
const db=require('D:\\BackendEcommerce\\Ecommerce\\BACKEND\\ADMIN\\config\\db.js')
exports.addProduct = (req, res) => {
  const { product_name, price, unit, quantity, exchangable, refundable, created_by, description, category_id, sub_category_id } = req.body;

  console.log('Request Body:', req.body);
  console.log('Uploaded Files:', req.files);

  // Check if image files are uploaded
  const image = req.files?.image?.[0]?.path || null;
  const image2 = req.files?.image2?.[0]?.path || null;

  // Validate input fields
  if (!product_name || !price || !unit || !quantity || !category_id || !sub_category_id) {
    return res.status(400).send({ message: 'Required fields are missing' });
  }

  // Check if the category exists
  const getCategoryQuery = 'SELECT category_id FROM main_categor WHERE category_id = ?';
  db.query(getCategoryQuery, [category_id], (err, categoryResults) => {
    if (err) {
      return res.status(500).send({ message: 'Database error', error: err.message });
    }
    if (categoryResults.length === 0) {
      return res.status(400).send({ message: 'Category not found' });
    }

    // Check if the subcategory exists for the category
    const getSubCategoryQuery = 'SELECT sub_category_id FROM sub_categor WHERE sub_category_id = ? AND main_category_id = ?';
    db.query(getSubCategoryQuery, [sub_category_id, category_id], (err, subCategoryResults) => {
      if (err) {
        return res.status(500).send({ message: 'Database error', error: err.message });
      }
      if (subCategoryResults.length === 0) {
        return res.status(400).send({ message: 'Subcategory not found for the category' });
      }

      // Insert the product into the database
      const query = `
        INSERT INTO product 
        (product_name, price, unit, quantity, exchangable, refundable, created_by, description, image, image2, category_id, sub_category_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(query, [product_name, price, unit, quantity, exchangable, refundable, created_by, description, image, image2, category_id, sub_category_id], (err, result) => {
        if (err) {
          return res.status(500).send({ message: 'Error inserting product', error: err.message });
        }
        res.status(200).send({ message: 'Product added successfully', product_id: result.insertId });
      });
    });
  });
};


// Get all products
exports.getAllProducts = (req, res) => {
  const query = `
      SELECT p.product_id, p.product_name, p.price, p.unit, p.quantity, p.exchangable, p.refundable, p.created_by, p.description, 
             p.image, p.image2, p.modified_by, p.modified_date, p.created_date, p.status,
             c.category_name, s.sub_category_name
      FROM product p
      JOIN main_categor c ON p.category_id = c.category_id
      JOIN sub_categor s ON p.sub_category_id = s.sub_category_id
      ORDER BY p.created_date ASC, p.product_id ASC;  -- Sort by created_date ascending (newer products last), and product_id for tie-breaking
  `;

  db.query(query, (err, results) => {
      if (err) {
          return res.status(500).send({ message: 'Error fetching products', error: err.message });
      }
      if (results.length === 0) {
          return res.status(404).send({ message: 'No products found' });
      }

      // Send all products as the response with the full URL for images
      const products = results.map(product => ({
          product_id: product.product_id,
          product_name: product.product_name,
          price: product.price,
          unit: product.unit,
          quantity: product.quantity,
          exchangable: product.exchangable,
          refundable: product.refundable,
          created_by: product.created_by,
          description: product.description,
          image: `/${product.image}`,  
          image2: `/${product.image2}`,
          category_name: product.category_name,
          sub_category_name: product.sub_category_name,
          status: product.status,
          modified_by: product.modified_by,
          modified_date: product.modified_date,
          created_date: product.created_date
      }));

      res.status(200).send({ products });
  });
};


exports.updateProduct = (req, res) => {
  const { 
      product_id, 
      product_name, 
      price, 
      unit, 
      quantity, 
      exchangable, 
      refundable, 
      modified_by, 
      description
  } = req.body;

  console.log('Request Body:', req.body);
  console.log('Uploaded Files:', req.files);

  // Validate input fields
  if (!product_id || !product_name || !price || !unit || !quantity || !modified_by) {
      return res.status(400).send({ message: 'Product ID, product name, price, unit, quantity, and modified_by are required' });
  }

  // Handle optional file updates
  const image = req.files?.['image'] ? req.files['image'][0].path : null;
  const image2 = req.files?.['image2'] ? req.files['image2'][0].path : null;

  // Fetch current product details
  const getProductQuery = 'SELECT * FROM product WHERE product_id = ?';
  db.query(getProductQuery, [product_id], (err, productResults) => {
      if (err) {
          return res.status(500).send({ message: 'Error fetching product details', error: err.message });
      }
      if (productResults.length === 0) {
          return res.status(404).send({ message: 'Product not found' });
      }

      const currentProduct = productResults[0];

      // Use current images if no new images are uploaded
      const finalImage = image || currentProduct.image;
      const finalImage2 = image2 || currentProduct.image2;

      // Update the product
      const query = `
          UPDATE product 
          SET product_name = ?, price = ?, unit = ?, quantity = ?, exchangable = ?, refundable = ?, 
              modified_by = ?, description = ?, image = ?, image2 = ?
          WHERE product_id = ?;
      `;
      db.query(query, [product_name, price, unit, quantity, exchangable, refundable, modified_by, description, finalImage, finalImage2, product_id], (err, result) => {
          if (err) {
              return res.status(500).send({ message: 'Error updating product', error: err.message });
          }

          if (result.affectedRows === 0) {
              return res.status(404).send({ message: 'Product not found' });
          }

          res.status(200).send({ message: 'Product updated successfully' });
      });
  });
};


exports.ProductStatus = (req, res) => {
  const { product_id, modified_by, status } = req.body;  // Extract product_id, modified_by, and status from request body

  // Validate input fields
  if (!product_id || !modified_by || (status !== 0 && status !== 1)) {
    return res.status(400).send({ message: 'Product ID, modified_by, and valid status (0 or 1) are required' });
  }

  // Define status message based on the status value
  const statusMessage = status === 1 ? 'active' : 'inactive';

  // Update the product status
  const query = 'UPDATE product SET modified_by = ?, status = ? WHERE product_id = ?';
  db.query(query, [modified_by, status, product_id], (err, result) => {
    if (err) {
      return res.status(500).send({ message: 'Error updating product status', error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Product not found' });
    }

    res.status(200).send({ message: `Product status updated and set to ${statusMessage}` });
  });
};



