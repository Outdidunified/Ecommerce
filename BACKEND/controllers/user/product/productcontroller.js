const db = require('../../../config/db');

exports.getProducts = async (req, res) => {
  const { sub_category_id } = req.body;

  // Validate input
  if (!sub_category_id) {
    return res.status(400).send({ message: 'sub_category_id is required' });
  }

  try {
    // Add a condition to filter by status = 1
    const query = 'SELECT * FROM product WHERE sub_category_id = ? AND status = 1';
    
    // Use async/await to fetch data
    const [results] = await db.query(query, [sub_category_id]);

    // Check if no products were found
    if (results.length === 0) {
      return res.status(400).send({ message: 'No products found' });
    }

    // Map results into a more structured response
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
      status: product.status,
      modified_by: product.modified_by,
      modified_date: product.modified_date,
      created_date: product.created_date
    }));

    // Send the response with the filtered products
    res.status(200).send({ products });

  } catch (err) {
    console.error('Error fetching products:', err);
    return res.status(500).send({ message: 'Error fetching products', error: err.message });
  }
};

exports.getProductsByCategory = async (req, res) => {
  const { category_id } = req.body;  // Get category_id from the request body

  // Validate input
  if (!category_id) {
    return res.status(400).send({ message: 'category_id is required' });
  }

  try {
    // Add a condition to filter by status = 1 and category_id
    const query = 'SELECT * FROM product WHERE category_id = ? AND status = 1';
    
    // Fetch data from the database
    const [results] = await db.query(query, [category_id]);

    // Check if no products were found
    if (results.length === 0) {
      return res.status(400).send({ message: 'No products found ' });
    }

    // Map results into a more structured response
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
      status: product.status,
      modified_by: product.modified_by,
      modified_date: product.modified_date,
      created_date: product.created_date
    }));

    // Send the response with the filtered products
    res.status(200).send({ products });

  } catch (err) {
    console.error('Error fetching products:', err);
    return res.status(500).send({ message: 'Error fetching products', error: err.message });
  }
};


exports.getsubcateg = async (req, res) => {
  // Get category_id from the request body
  const { category_id } = req.body; // Assuming the category_id is sent in the request body

  if (!category_id) {
    return res.status(400).send({ message: 'category_id is required' });
  }

  console.log(`Fetching subcategories for category_id: ${category_id}`);

  // Query to get subcategories based on the provided category_id and status = 1
  const query = `
    SELECT sub_category_id, sub_category_name 
    FROM sub_categor
    WHERE main_category_id = ? AND status = 1`;

  try {
    // Use async/await to execute the query
    const [results] = await db.query(query, [category_id]);

    if (results.length === 0) {
      return res.status(400).send({ message: 'No subcategories found' });
    }

    console.log('Subcategories fetched:', results);

    // Return the list of subcategories
    res.status(200).send({
      message: 'Subcategories retrieved successfully',
      subcategories: results,
    });

  } catch (err) {
    console.error('Error fetching subcategories:', err.message);
    return res.status(500).send({ message: 'Error fetching subcategories', error: err.message });
  }
};


exports.getcategory = async (req, res) => {
  const query = 'SELECT category_id, category_name FROM main_categor WHERE status = 1';

  try {
    // Use async/await to fetch data
    const [results] = await db.query(query);

    if (results.length === 0) {
      return res.status(400).json({ message: 'No categories found' });
    }

    res.status(200).json({ categories: results });

  } catch (err) {
    console.error('Error fetching categories:', err.message);
    return res.status(500).json({ message: 'Error fetching categories', error: err.message });
  }
};

  
exports.getAllProducts = async (req, res) => {
  const query = `
    SELECT p.product_id, p.product_name, p.price, p.unit, p.quantity, p.exchangable, p.refundable, p.created_by, p.description, 
           p.image, p.image2, p.modified_by, p.modified_date, p.created_date, p.status,
           c.category_name, s.sub_category_name, p.sub_category_id, p.category_id
    FROM product p
    JOIN main_categor c ON p.category_id = c.category_id
    JOIN sub_categor s ON p.sub_category_id = s.sub_category_id
    WHERE p.status = 1  -- Filter products where status = 1
    ORDER BY p.created_date ASC, p.product_id ASC;  -- Sort by created_date ascending (newer products last), and product_id for tie-breaking
  `;

  try {
    // Use async/await to fetch data
    const [results] = await db.query(query);

    if (results.length === 0) {
      return res.status(400).send({ message: 'No products found' });
    }

    // Map the result to a structured response
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
      sub_category_id: product.sub_category_id,
      category_id: product.category_id,
      status: product.status,
      modified_by: product.modified_by,
      modified_date: product.modified_date,
      created_date: product.created_date
    }));

    res.status(200).send({ products });

  } catch (err) {
    console.error('Error fetching products:', err.message);
    return res.status(500).send({ message: 'Error fetching products', error: err.message });
  }
};


exports.searchProducts = async (req, res) => {
  const { searchQuery } = req.body;

  if (!searchQuery) {
    return res.status(400).send({ message: 'Search query is required' });
  }

  // SQL query for searching products by name, description, category, or sub-category
  const query = `
    SELECT 
      p.product_id, p.product_name, p.price, p.unit, p.quantity, 
      p.exchangable, p.refundable, p.created_by, p.description, 
      p.image, p.image2, p.modified_by, p.modified_date, 
      p.created_date, p.status, 
      c.category_name, s.sub_category_name 
    FROM 
      product p
    LEFT JOIN 
      main_categor c ON p.category_id = c.category_id
    LEFT JOIN 
      sub_categor s ON p.sub_category_id = s.sub_category_id
    WHERE 
      (p.product_name LIKE ? OR 
      p.description LIKE ? OR 
      c.category_name LIKE ? OR 
      s.sub_category_name LIKE ?) 
      AND p.status = 1
    ORDER BY 
      p.created_date DESC, p.product_id ASC;
  `;

  const searchKeyword = `%${searchQuery}%`;

  try {
    // Use async/await to fetch data
    const [results] = await db.query(query, [searchKeyword, searchKeyword, searchKeyword, searchKeyword]);

    if (results.length === 0) {
      return res.status(404).send({ message: 'No products found' });
    }

    // Format the results
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
      sub_category_id: product.sub_category_id,
      category_id: product.category_id,
      status: product.status,
      modified_by: product.modified_by,
      modified_date: product.modified_date,
      created_date: product.created_date
    }));

    // Send the formatted products in the response
    res.status(200).send({ products });

  } catch (err) {
    console.error('Error searching for products:', err.message);
    return res.status(500).send({ message: 'Error searching for products', error: err.message });
  }
};

