const db = require('../../config/db');

exports.addProduct = (req, res) => {
  console.log(req.body);
  const { 
    product_name, 
    price, 
    unit, 
    quantity, 
    exchangable, 
    refundable, 
    created_by, 
    description, 
    image, 
    image2, 
    category_id,   
    sub_category_id
  } = req.body;
  console.log(req.body);

  // Validate input fields
  if (!product_name || !price || !unit || !quantity || !category_id || !sub_category_id) {
    return res.status(400).send({ message: 'Product name, price, unit, quantity, category_id, and sub_category_id are required' });
  }

  // Check if the category_id exists
  const getCategoryQuery = 'SELECT category_id FROM main_categor WHERE category_id = ?';
  db.query(getCategoryQuery, [category_id], (err, categoryResults) => {
    if (err) {
      return res.status(500).send({ message: 'Error fetching category', error: err.message });
    }
    if (categoryResults.length === 0) {
      return res.status(400).send({ message: 'Category not found' });
    }

    // Check if the sub_category_id exists for the given category_id
    const getSubCategoryQuery = 'SELECT sub_category_id FROM sub_categor WHERE sub_category_id = ? AND main_category_id = ?';
    db.query(getSubCategoryQuery, [sub_category_id, category_id], (err, subCategoryResults) => {
      if (err) {
        return res.status(500).send({ message: 'Error fetching subcategory', error: err.message });
      }
      if (subCategoryResults.length === 0) {
        return res.status(400).send({ message: 'Subcategory not found for the given category' });
      }

      // Insert the new product into the product table
      const query = `
        INSERT INTO product 
        (product_name, price, unit, quantity, exchangable, refundable, created_by, description, image, image2, category_id, sub_category_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(query, [product_name, price, unit, quantity, exchangable, refundable, created_by, description, image, image2, category_id, sub_category_id], (err, result) => {
        if (err) {
          return res.status(500).send({ message: 'Error adding product', error: err.message });
        }
        res.status(200).send({ message: 'Product added successfully', product_id: result.insertId });
      });
    });
  });
};



// Get all products
// Get all products
exports.getAllProducts = (req, res) => {
  const query = `
      SELECT p.product_id, p.product_name, p.price, p.unit, p.quantity, p.exchangable, p.refundable, p.created_by, p.description, p.image, p.image2, 
             p.modified_by, p.modified_date, p.created_date,
             c.category_name, s.sub_category_name
      FROM product p
      JOIN main_categor c ON p.category_id = c.category_id
      JOIN sub_categor s ON p.sub_category_id = s.sub_category_id
  `;

  db.query(query, (err, results) => {
      if (err) {
          return res.status(500).send({ message: 'Error fetching products', error: err.message });
      }
      if (results.length === 0) {
          return res.status(404).send({ message: 'No products found' });
      }

      // Send all products as the response with the additional fields
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
          image: product.image,
          image2: product.image2,
          category_name: product.category_name,
          sub_category_name: product.sub_category_name,
          modified_by: product.modified_by,       // Added modified_by
          modified_date: product.modified_date,   // Added modified_date
          created_date: product.created_date      // Added created_date
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
      description, 
      image, 
      image2, 
      category_id, 
      sub_category_id 
  } = req.body;

  // Validate input fields
  if (!product_id || !product_name || !price || !unit || !quantity || !category_id || !sub_category_id || !modified_by) {
      return res.status(400).send({ message: 'Product ID, product name, price, unit, quantity, category_id, sub_category_id, and modified_by are required' });
  }

  // Check if the category_id exists
  const getCategoryQuery = 'SELECT category_id FROM main_categor WHERE category_id = ?';
  db.query(getCategoryQuery, [category_id], (err, categoryResults) => {
      if (err) {
          return res.status(500).send({ message: 'Error fetching category', error: err.message });
      }
      if (categoryResults.length === 0) {
          return res.status(400).send({ message: 'Category not found' });
      }

      // Check if the sub_category_id exists for the given category_id
      const getSubCategoryQuery = 'SELECT sub_category_id FROM sub_categor WHERE sub_category_id = ? AND main_category_id = ?';
      db.query(getSubCategoryQuery, [sub_category_id, category_id], (err, subCategoryResults) => {
          if (err) {
              return res.status(500).send({ message: 'Error fetching subcategory', error: err.message });
          }
          if (subCategoryResults.length === 0) {
              return res.status(400).send({ message: 'Subcategory not found for the given category' });
          }

          // Check the current product details before updating
          const getProductQuery = 'SELECT * FROM product WHERE product_id = ?';
          db.query(getProductQuery, [product_id], (err, productResults) => {
              if (err) {
                  return res.status(500).send({ message: 'Error fetching product details', error: err.message });
              }
              if (productResults.length === 0) {
                  return res.status(404).send({ message: 'Product not found' });
              }

              const currentProduct = productResults[0];

              // Check if any values are different from the current values
              const changes = [];
              if (product_name !== currentProduct.product_name) changes.push('product_name');
              if (price !== currentProduct.price) changes.push('price');
              if (unit !== currentProduct.unit) changes.push('unit');
              if (quantity !== currentProduct.quantity) changes.push('quantity');
              if (exchangable !== currentProduct.exchangable) changes.push('exchangable');
              if (refundable !== currentProduct.refundable) changes.push('refundable');
              if (description !== currentProduct.description) changes.push('description');
              if (image !== currentProduct.image) changes.push('image');
              if (image2 !== currentProduct.image2) changes.push('image2');
              if (category_id !== currentProduct.category_id) changes.push('category_id');
              if (sub_category_id !== currentProduct.sub_category_id) changes.push('sub_category_id');

              // If no changes, return a message indicating no changes
              if (changes.length === 0) {
                  return res.status(200).send({ message: 'No changes made to the product.' });
              }

              // If changes are detected, update the product
              const query = `
                  UPDATE product 
                  SET product_name = ?, price = ?, unit = ?, quantity = ?, exchangable = ?, refundable = ?, 
                      modified_by = ?, description = ?, image = ?, image2 = ?, category_id = ?, sub_category_id = ?
                  WHERE product_id = ?;
              `;
              db.query(query, [product_name, price, unit, quantity, exchangable, refundable, modified_by, description, image, image2, category_id, sub_category_id, product_id], (err, result) => {
                  if (err) {
                      return res.status(500).send({ message: 'Error updating product', error: err.message });
                  }

                  if (result.affectedRows === 0) {
                      return res.status(404).send({ message: 'Product not found' });
                  }

                  res.status(200).send({ message: 'Product updated successfully' });
              });
          });
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



