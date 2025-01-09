const db=require('../../../config/db');
  exports.getProducts = (req, res) => {
    const { sub_category_id } = req.body;
  
    if (!sub_category_id) {
      return res.status(400).send({ message: 'sub_category_id is required' });
    }
  
    const query = 'SELECT * FROM product WHERE sub_category_id = ?';
  
    db.query(query, [sub_category_id], (err, results) => {
      if (err) {
        return res.status(500).send({ message: 'Error fetching products', error: err.message });
      }
  
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
  
    res.status(200).send({ products });
  });
  };

  exports.getsubcateg = (req, res) => {
    // Get category_id from the request body
    const { category_id } = req.body; // Assuming the category_id is sent in the request body
  
    if (!category_id) {
      return res.status(400).send({ message: 'category_id is required' });
    }
  
    console.log(`Fetching subcategories for category_id: ${category_id}`);
  
    // Query to get subcategories based on the provided category_id
    const query = `
      SELECT sub_category_id, sub_category_name 
      FROM sub_categor
      WHERE main_category_id = ?`;
  
    db.query(query, [category_id], (err, results) => {
      if (err) {
        console.error('Error fetching subcategories:', err.message);
        return res.status(500).send({ message: 'Error fetching subcategories', error: err.message });
      }
  
      console.log('Subcategories fetched:', results);
  
      // Return the list of subcategories
      res.status(200).send({
        message: 'Subcategories retrieved successfully',
        subcategories: results,
      });
    });
  };

  exports.getcategory = (req, res) => {
    // Query to get categories from the database
    const query = 'SELECT category_id, category_name FROM main_categor';
  
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching categories', error: err.message });
      }
      res.status(200).json({ categories: results });
    });
  };
  
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
            sub_category_id:product.sub_category_id,
            category_id:product.category_id,
            status: product.status,
            modified_by: product.modified_by,
            modified_date: product.modified_date,
            created_date: product.created_date
        }));
  
        res.status(200).send({ products });
    });
  };

  exports.searchProducts = (req, res) => {
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
        p.product_name LIKE ? OR 
        p.description LIKE ? OR 
        c.category_name LIKE ? OR 
        s.sub_category_name LIKE ?
      ORDER BY 
        p.created_date DESC, p.product_id ASC;
    `;
  
    const searchKeyword = `%${searchQuery}%`;
  
    db.query(query, [searchKeyword, searchKeyword, searchKeyword, searchKeyword], (err, results) => {
      if (err) {
        return res.status(500).send({ message: 'Error searching for products', error: err.message });
      }
  
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
  
      res.status(200).send({ products });
    });
  };
  