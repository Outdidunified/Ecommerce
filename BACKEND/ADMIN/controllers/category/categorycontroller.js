
//const connection=require('../admin/config/db');// Import the connection object
const connection=require('D:\\BackendEcommerce\\Ecommerce\\BACKEND\\ADMIN\\config\\db.js')
const checkCategoryExists = (category_name, callback) => {
  const query = 'SELECT * FROM main_categor WHERE category_name = ?';
  connection.query(query, [category_name], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, results.length > 0);
  });
};

// Function to add a category
exports.addCategory = (req, res) => {
  const { category_name, created_by } = req.body;

  // Validate input fields
  if (!category_name || !created_by) {
    return res.status(400).send({ message: 'Category name and created_by are required' });
  }

  // Check if category already exists
  checkCategoryExists(category_name, (err, exists) => {
    if (err) {
      return res.status(500).send({ message: 'Error checking category existence', error: err.message });
    }

    if (exists) {
      return res.status(400).send({ message: 'Category already exists' });
    }

    // Insert the new category if it doesn't exist
    const query = 'INSERT INTO main_categor (category_name, created_by) VALUES (?, ?)';
    connection.query(query, [category_name, created_by], (err, result) => {
      if (err) {
        return res.status(500).send({ message: 'Error adding category', error: err.message });
      }
      res.status(200).send({ message: 'Category added successfully', category_id: result.insertId });
    });
  });
};

// Function to check if a subcategory already exists
const checkSubCategoryExists = (main_category_id, sub_category_name, callback) => {
  const query = 'SELECT * FROM sub_categor WHERE main_category_id = ? AND sub_category_name = ?';
  connection.query(query, [main_category_id, sub_category_name], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, results.length > 0);
  });
};

// Function to add a subcategory
exports.addSubCategory = (req, res) => {
  const { main_category_id, sub_category_name, created_by } = req.body;

  // Validate input fields
  if (!main_category_id || !sub_category_name || !created_by) {
    return res.status(400).send({ message: 'Main category ID, subcategory name, and created_by are required' });
  }

  // Check if subcategory already exists under the given main category
  checkSubCategoryExists(main_category_id, sub_category_name, (err, exists) => {
    if (err) {
      return res.status(500).send({ message: 'Error checking subcategory existence', error: err.message });
    }

    if (exists) {
      return res.status(400).send({ message: 'Subcategory already exists under this category' });
    }

    // Insert the new subcategory if it doesn't exist
    const query = 'INSERT INTO sub_categor (main_category_id, sub_category_name, created_by) VALUES (?, ?, ?)';
    connection.query(query, [main_category_id, sub_category_name, created_by], (err, result) => {
      if (err) {
        return res.status(500).send({ message: 'Error adding subcategory', error: err.message });
      }
      res.status(200).send({ message: 'Subcategory added successfully', sub_category_id: result.insertId });
    });
  });
};

// Function to get all main categories with their respective subcategories
exports.getAllCategories = (req, res) => {
  // Query to fetch all main categories
  const query = 'SELECT * FROM main_categor WHERE status = TRUE';

  connection.query(query, (err, mainCategories) => {
    if (err) {
      return res.status(500).send({ message: 'Error fetching main categories', error: err.message });
    }

    // If no main categories are found
    if (mainCategories.length === 0) {
      return res.status(404).send({ message: 'No main categories found' });
    }

    // For each main category, fetch the subcategories
    const categoriesWithSubCategories = [];

    // Process each main category
    const fetchSubCategoriesPromises = mainCategories.map((mainCategory) => {
      return new Promise((resolve, reject) => {
        const subCategoryQuery = 'SELECT * FROM sub_categor WHERE main_category_id = ? AND status = TRUE';

        connection.query(subCategoryQuery, [mainCategory.category_id], (err, subCategories) => {
          if (err) {
            reject({ message: 'Error fetching subcategories', error: err.message });
          } else {
            categoriesWithSubCategories.push({
              main_category: mainCategory,
              sub_categories: subCategories
            });
            resolve();
          }
        });
      });
    });

    // Wait for all subcategory queries to complete
    Promise.all(fetchSubCategoriesPromises)
      .then(() => {
        res.status(200).send({ categories: categoriesWithSubCategories });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  });
};


// Function to update a category
exports.updateCategory = (req, res) => {
  const { category_id, category_name, modified_by } = req.body;  // Extract category_id, category_name, and modified_by from request body

  // Validate input fields
  if (!category_id || !category_name || !modified_by) {
    return res.status(400).send({ message: 'Category ID, category name, and modified_by are required' });
  }

  // Check if the category exists before updating
  const checkQuery = 'SELECT category_name, modified_by FROM main_categor WHERE category_id = ?';
  connection.query(checkQuery, [category_id], (err, results) => {
    if (err) {
      return res.status(500).send({ message: 'Error checking category', error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).send({ message: 'Category not found' });
    }

    const existingCategory = results[0];

    // Check if the values are the same, if so, no need to update
    if (existingCategory.category_name === category_name && existingCategory.modified_by === modified_by) {
      return res.status(400).send({ message: 'No changes detected' });
    }

    // Proceed with the update
    const query = 'UPDATE main_categor SET category_name = ?, modified_by = ? WHERE category_id = ?';
    connection.query(query, [category_name, modified_by, category_id], (err, result) => {
      if (err) {
        return res.status(500).send({ message: 'Error updating category', error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).send({ message: 'Category not found' });
      }

      res.status(200).send({ message: 'Category updated successfully' });
    });
  });
};


// Function to update a subcategory
exports.updateSubCategory = (req, res) => {
  const { sub_category_id, main_category_id, sub_category_name, modified_by } = req.body;  // Extract values from request body

  // Validate input fields
  if (!sub_category_id || !main_category_id || !sub_category_name || !modified_by) {
    return res.status(400).send({ message: 'Subcategory ID, main category ID, subcategory name, and modified_by are required' });
  }

  // Check if the subcategory exists before updating
  const checkQuery = 'SELECT sub_category_name, modified_by FROM sub_categor WHERE sub_category_id = ? AND main_category_id = ?';
  connection.query(checkQuery, [sub_category_id, main_category_id], (err, results) => {
    if (err) {
      return res.status(500).send({ message: 'Error checking subcategory', error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).send({ message: 'Subcategory not found' });
    }

    const existingSubCategory = results[0];

    // Check if the values are the same, if so, no need to update
    if (existingSubCategory.sub_category_name === sub_category_name && existingSubCategory.modified_by === modified_by) {
      return res.status(400).send({ message: 'No changes detected' });
    }

    // Proceed with the update (Only update sub_category_name and modified_by, not the status)
    const query = 'UPDATE sub_categor SET sub_category_name = ?, modified_by = ? WHERE sub_category_id = ? AND main_category_id = ?';
    connection.query(query, [sub_category_name, modified_by, sub_category_id, main_category_id], (err, result) => {
      if (err) {
        return res.status(500).send({ message: 'Error updating subcategory', error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).send({ message: 'Subcategory not found' });
      }

      res.status(200).send({ message: 'Subcategory updated successfully' });
    });
  });
};



exports.getsubCategories = (req, res) => {
  const query = 'SELECT category_id, category_name, created_by, status,created_date,modified_by,modified_date FROM main_categor';

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).send({ message: 'Error fetching categories', error: err.message });
    }

    // Return the list of categories
    res.status(200).send({
      message: 'Categories retrieved successfully',
      categories: results,
    });
  });
};

exports.getcategory = (req, res) => {
  // Query to get categories from the database
  const query = 'SELECT category_id, category_name FROM main_categor';

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching categories', error: err.message });
    }
    res.status(200).json({ categories: results });
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

  connection.query(query, [category_id], (err, results) => {
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


exports.getAllSubCategories = (req, res) => {
  const query = `
      SELECT 
          sub_categor.sub_category_id, 
          sub_categor.sub_category_name, 
          sub_categor.main_category_id, 
          main_categor.category_name AS main_category_name, 
          sub_categor.created_by, 
          sub_categor.created_date,
          sub_categor.status, 
          sub_categor.modified_by, 
          sub_categor.modified_date  
      FROM 
          sub_categor 
      INNER JOIN 
          main_categor 
      ON 
          sub_categor.main_category_id = main_categor.category_id
  `;

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).send({
        status: 'error',
        message: 'Error fetching subcategories',
        error: err.message
      });
    }

    // If no subcategories are found
    if (results.length === 0) {
      return res.status(404).send({
        status: 'error',
        message: 'No subcategories found'
      });
    }

    // Return the list of subcategories along with their status
    res.status(200).send({
      status: 'success',
      message: 'Subcategories retrieved successfully',
      subcategories: results
    });
  });
};




exports.deleteCategory = (req, res) => {
  const { category_id, modified_by, status } = req.body;  // Extract category_id, modified_by, and status from request body

  // Validate input fields
  if (!category_id || !modified_by || (status !== 0 && status !== 1)) {
    return res.status(400).send({ message: 'Category ID, modified_by, and valid status (0 or 1) are required' });
  }

  // Check the current status of the category
  const checkStatusQuery = 'SELECT status FROM main_categor WHERE category_id = ?';
  connection.query(checkStatusQuery, [category_id], (err, result) => {
    if (err) {
      return res.status(500).send({ message: 'Error checking category status', error: err.message });
    }

    if (result.length === 0) {
      return res.status(404).send({ message: 'Category not found' });
    }

    const currentStatus = result[0].status;

    // If the status is the same, no changes happened
    if (currentStatus === status) {
      return res.status(400).send({ message: 'No changes made. The status is already the same.' });
    }

    // If status needs to be updated, proceed with the update
    const statusMessage = status === 1 ? 'active' : 'inactive';
    const updateQuery = 'UPDATE main_categor SET modified_by = ?, status = ? WHERE category_id = ?';
    connection.query(updateQuery, [modified_by, status, category_id], (err, result) => {
      if (err) {
        return res.status(500).send({ message: 'Error updating category', error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).send({ message: 'Category not found' });
      }

      res.status(200).send({ message: `Category updated and status set to ${statusMessage}` });
    });
  });
};

exports.deleteSubCategory = (req, res) => {
  const { sub_category_id, modified_by, status } = req.body;  // Extract sub_category_id, modified_by, and status from request body

  // Validate input fields
  if (!sub_category_id || !modified_by || (status !== 0 && status !== 1)) {
    return res.status(400).send({ message: 'Subcategory ID, modified_by, and valid status (0 or 1) are required' });
  }

  // Define status message based on the status value
  const statusMessage = status === 1 ? 'active' : 'inactive';

  // First, check the current status of the subcategory
  const checkStatusQuery = 'SELECT status FROM sub_categor WHERE sub_category_id = ?';
  connection.query(checkStatusQuery, [sub_category_id], (err, result) => {
    if (err) {
      return res.status(500).send({ message: 'Error checking subcategory status', error: err.message });
    }

    if (result.length === 0) {
      return res.status(404).send({ message: 'Subcategory not found' });
    }

    const currentStatus = result[0].status;

    // If the status is the same, no changes happened
    if (currentStatus === status) {
      return res.status(400).send({ message: 'No changes made. The status is already the same.' });
    }

    // If status needs to be updated, proceed with the update
    const updateQuery = 'UPDATE sub_categor SET modified_by = ?, status = ? WHERE sub_category_id = ?';
    connection.query(updateQuery, [modified_by, status, sub_category_id], (err, result) => {
      if (err) {
        return res.status(500).send({ message: 'Error updating subcategory', error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).send({ message: 'Subcategory not found' });
      }

      res.status(200).send({ message: `Subcategory status updated to ${statusMessage}` });
    });
  });
};
