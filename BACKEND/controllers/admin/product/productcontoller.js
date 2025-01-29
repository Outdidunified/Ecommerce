const db = require('../../../config/db');

exports.addProduct = async (req, res) => {
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

  try {
    // Check if the category exists
    const getCategoryQuery = 'SELECT category_id FROM main_categor WHERE category_id = ?';
    const [categoryResults] = await db.query(getCategoryQuery, [category_id]);

    // Handle no categories found with custom message
    if (categoryResults.length === 0) {
      return res.status(400).send({ message: 'No categories found, please add a category first' });
    }

    // Check if the subcategory exists for the category
    const getSubCategoryQuery = 'SELECT sub_category_id FROM sub_categor WHERE sub_category_id = ? AND main_category_id = ?';
    const [subCategoryResults] = await db.query(getSubCategoryQuery, [sub_category_id, category_id]);

    // Handle no subcategory found with custom message
    if (subCategoryResults.length === 0) {
      return res.status(400).send({ message: 'Subcategory not found for the selected category' });
    }

    // Insert the product into the database
    const insertProductQuery = `
      INSERT INTO product 
      (product_name, price, unit, quantity, exchangable, refundable, created_by, description, image, image2, category_id, sub_category_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [insertResult] = await db.query(insertProductQuery, [product_name, price, unit, quantity, exchangable, refundable, created_by, description, image, image2, category_id, sub_category_id]);

    res.status(200).send({
      message: 'Product added successfully',
      product_id: insertResult.insertId
    });

  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).send({ message: 'Error processing your request', details: err });
  }
};

  

exports.getAllProducts = async (req, res) => {
  const query = `
      SELECT p.product_id, p.product_name, p.price, p.unit, p.quantity, p.exchangable, p.refundable, 
             p.created_by, p.description, p.image, p.image2, p.modified_by, 
             p.modified_date, p.created_date, p.status,
             c.category_name, s.sub_category_name
      FROM product p
      JOIN main_categor c ON p.category_id = c.category_id
      JOIN sub_categor s ON p.sub_category_id = s.sub_category_id
      ORDER BY p.created_date ASC, p.product_id ASC;
  `;
  
  try {
    // Execute query using async/await
    const [results] = await db.query(query);

    // Check if any products are found
    if (results.length === 0) {
      return res.status(404).send({ message: 'No products found' });
    }

    // Map the results and construct the response with image URLs
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
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).send({ message: 'Error fetching products', error: err.message });
  }
};



exports.updateProduct = async (req, res) => {
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

  try {
    // Fetch current product details
    const [productResults] = await db.query('SELECT * FROM product WHERE product_id = ?', [product_id]);

    if (productResults.length === 0) {
      return res.status(404).send({ message: 'Product not found' });
    }

    const currentProduct = productResults[0];

    // Use current images if no new images are uploaded
    const finalImage = image || currentProduct.image;
    const finalImage2 = image2 || currentProduct.image2;

    // Log the comparison data
    console.log("Comparing Product Data:", {
      currentProduct,
      product_name,
      price,
      unit,
      quantity,
      exchangable,
      refundable,
      modified_by,
      description,
      finalImage,
      finalImage2
    });

    // Check for changes
    const isNoChange = 
      product_name === currentProduct.product_name &&
      price == currentProduct.price &&
      unit === currentProduct.unit &&
      quantity == currentProduct.quantity &&
      exchangable == currentProduct.exchangable &&
      refundable == currentProduct.refundable &&
      modified_by === currentProduct.modified_by &&
      description === currentProduct.description &&
      finalImage === currentProduct.image &&
      finalImage2 === currentProduct.image2;

    console.log("Is no change:", isNoChange);  // Log this

    if (isNoChange) {
      return res.status(400).send({ message: 'No changes happened' }); // 200 status with message
    }

    // Update the product if there are changes
    const query = `
      UPDATE product 
      SET product_name = ?, price = ?, unit = ?, quantity = ?, exchangable = ?, refundable = ?, 
          modified_by = ?, description = ?, image = ?, image2 = ? 
      WHERE product_id = ?;
    `;
    const [result] = await db.query(query, [product_name, price, unit, quantity, exchangable, refundable, modified_by, description, finalImage, finalImage2, product_id]);

    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Product not found' });
    }

    res.status(200).send({ message: 'Product updated successfully' });
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).send({ message: 'Error updating product', error: err.message });
  }
};



  
exports.ProductStatus = async (req, res) => {
  const { product_id, modified_by, status } = req.body;

  // Validate input fields
  if (!product_id || !modified_by || (status !== 0 && status !== 1)) {
    return res.status(400).send({ message: 'Product ID, modified_by, and valid status (0 or 1) are required' });
  }

  // Define status message based on the status value
  const statusMessage = status === 1 ? 'active' : 'inactive';

  try {
    // Update the product status
    const [result] = await db.query('UPDATE product SET modified_by = ?, status = ? WHERE product_id = ?', [modified_by, status, product_id]);

    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Product not found' });
    }

    res.status(200).send({ message: `Product status updated and set to ${statusMessage}` });
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).send({ message: 'Error updating product status', error: err.message });
  }
};

  
  
  