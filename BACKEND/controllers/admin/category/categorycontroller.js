const connection = require('../../../config/db');

// Function to check if a category exists
const checkCategoryExists = async (category_name) => {
  const query = 'SELECT * FROM main_categor WHERE category_name = ?';
  try {
    const [results] = await connection.query(query, [category_name]);
    return results.length > 0;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Function to add a category
exports.addCategory = async (req, res) => {
  const { category_name, created_by } = req.body;

  // Validate input fields
  if (!category_name || !created_by) {
    return res.status(400).send({ message: 'Category name and created_by are required' });
  }

  try {
    // Check if category already exists
    const exists = await checkCategoryExists(category_name);

    if (exists) {
      return res.status(400).send({ message: 'Category already exists' });
    }

    // Insert the new category if it doesn't exist
    const query = 'INSERT INTO main_categor (category_name, created_by) VALUES (?, ?)';
    const [result] = await connection.query(query, [category_name, created_by]);

    res.status(200).send({ message: 'Category added successfully', category_id: result.insertId });
  } catch (err) {
    console.error('Error adding category:', err.message);
    res.status(500).send({ message: 'Error adding category', error: err.message });
  }
};

// Function to check if a subcategory exists
const checkSubCategoryExists = async (main_category_id, sub_category_name) => {
  const query = 'SELECT * FROM sub_categor WHERE main_category_id = ? AND sub_category_name = ?';
  try {
    const [results] = await connection.query(query, [main_category_id, sub_category_name]);
    return results.length > 0;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Function to add a subcategory


// Function to add a subcategory
exports.addSubCategory = async (req, res) => {
  const { main_category_id, sub_category_name, created_by } = req.body;

  // Validate input fields
  if (!main_category_id || !sub_category_name || !created_by) {
    return res.status(400).send({ message: 'Main category ID, subcategory name, and created_by are required' });
  }

  try {
    // Check if subcategory already exists under the given main category
    const exists = await checkSubCategoryExists(main_category_id, sub_category_name);

    if (exists) {
      return res.status(400).send({ message: 'Subcategory already exists under this category' });
    }

    // Insert the new subcategory if it doesn't exist
    const query = 'INSERT INTO sub_categor (main_category_id, sub_category_name, created_by) VALUES (?, ?, ?)';
    const [result] = await connection.query(query, [main_category_id, sub_category_name, created_by]);

    res.status(200).send({ message: 'Subcategory added successfully', sub_category_id: result.insertId });
  } catch (err) {
    console.error('Error adding subcategory:', err.message);
    res.status(500).send({ message: 'Error adding subcategory', error: err.message });
  }
};



// Function to get all categories with their subcategories
exports.getAllCategories = async (req, res) => {
  try {
    // Query to fetch all main categories with status = 1
    const [mainCategories] = await connection.query('SELECT * FROM main_categor WHERE status = 1');

    // If no main categories are found
    if (mainCategories.length === 0) {
      return res.status(404).send({ message: 'No main categories found' });
    }

    // Prepare promises to fetch subcategories for each main category
    const categoriesWithSubCategories = await Promise.all(
      mainCategories.map(async (mainCategory) => {
        const [subCategories] = await connection.query(
          'SELECT * FROM sub_categor WHERE main_category_id = ? AND status = 1',
          [mainCategory.category_id]
        );

        return {
          main_category: mainCategory,
          sub_categories: subCategories
        };
      })
    );

    res.status(200).send({ categories: categoriesWithSubCategories });
  } catch (err) {
    console.error('Error fetching categories:', err.message);
    res.status(500).send({ message: 'Error fetching categories', error: err.message });
  }
};




// Function to update a category
exports.updateCategory = async (req, res) => {
  const { category_id, category_name, modified_by } = req.body;

  // Validate input fields
  if (!category_id || !category_name || !modified_by) {
    return res.status(400).send({ message: 'Category ID, category name, and modified_by are required' });
  }

  try {
    // Check if the category exists
    const [results] = await connection.query('SELECT category_name, modified_by FROM main_categor WHERE category_id = ?', [category_id]);

    if (results.length === 0) {
      return res.status(404).send({ message: 'Category not found' });
    }

    const existingCategory = results[0];

    // Check if both category_name and modified_by are unchanged
    if (existingCategory.category_name === category_name && existingCategory.modified_by === modified_by) {
      return res.status(400).send({ message: 'No changes happened' });
    }

    // Proceed with the update
    const [updateResult] = await connection.query(
      'UPDATE main_categor SET category_name = ?, modified_by = ? WHERE category_id = ?',
      [category_name, modified_by, category_id]
    );

    // Check if any rows were actually affected
    if (updateResult.affectedRows === 0) {
      return res.status(200).send({ message: 'No changes happened' });
    }

    res.status(200).send({ message: 'Category updated successfully' });
  } catch (err) {
    console.error('Error updating category:', err.message);
    res.status(500).send({ message: 'Error updating category', error: err.message });
  }
};




// Function to update a subcategory
exports.updateSubCategory = async (req, res) => {
  const { sub_category_id, main_category_id, sub_category_name, modified_by } = req.body;

  // Validate input fields
  if (!sub_category_id || !main_category_id || !sub_category_name || !modified_by) {
    return res.status(400).send({ message: 'Subcategory ID, main category ID, subcategory name, and modified_by are required' });
  }

  try {
    // Check if the subcategory exists
    const [results] = await connection.query(
      'SELECT sub_category_name, modified_by FROM sub_categor WHERE sub_category_id = ? AND main_category_id = ?',
      [sub_category_id, main_category_id]
    );

    if (results.length === 0) {
      return res.status(404).send({ message: 'Subcategory not found' });
    }

    const existingSubCategory = results[0];

    // Check if the values are the same, if so, no need to update
    if (existingSubCategory.sub_category_name === sub_category_name && existingSubCategory.modified_by === modified_by) {
      return res.status(400).send({ message: 'No changes happened' });
    }

    // Proceed with the update
    const [updateResult] = await connection.query(
      'UPDATE sub_categor SET sub_category_name = ?, modified_by = ? WHERE sub_category_id = ? AND main_category_id = ?',
      [sub_category_name, modified_by, sub_category_id, main_category_id]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(404).send({ message: 'Subcategory not found' });
    }

    res.status(200).send({ message: 'Subcategory updated successfully' });
  } catch (err) {
    console.error('Error updating subcategory:', err.message);
    res.status(500).send({ message: 'Error updating subcategory', error: err.message });
  }
};



// Function to get all main categories
exports.getsubCategories = async (req, res) => {
  const query = 'SELECT category_id, category_name, created_by, status, created_date, modified_by, modified_date FROM main_categor';

  try {
    // Execute the query to fetch categories
    const [results] = await connection.query(query);

    // If no categories found
    if (results.length === 0) {
      return res.status(404).send({ message: 'No categories found' });
    }

    // Return the list of categories
    res.status(200).send({
      message: 'Categories retrieved successfully',
      categories: results,
    });
  } catch (err) {
    console.error('Error fetching categories:', err.message);
    res.status(500).send({ message: 'Error fetching categories', error: err.message });
  }
};


// Function to get all categories with status = 1
exports.getcategory = async (req, res) => {
  const query = 'SELECT category_id, category_name FROM main_categor WHERE status = 1';

  try {
    // Execute the query to fetch categories
    const [results] = await connection.query(query);

    // If no categories found
    if (results.length === 0) {
      return res.status(404).json({ message: 'No categories found. Please add a category first.' });
    }

    // Return the list of categories
    res.status(200).json({ categories: results });
  } catch (err) {
    console.error('Error fetching categories:', err.message);
    res.status(500).json({ message: 'Error fetching categories', error: err.message });
  }
};



// Function to fetch subcategories based on category_id
exports.getsubcateg = async (req, res) => {
  const { category_id } = req.body;

  // Validate input
  if (!category_id) {
    return res.status(400).send({ message: 'category_id is required' });
  }

  console.log(`Fetching subcategories for category_id: ${category_id}`);

  const query = `
    SELECT sub_category_id, sub_category_name 
    FROM sub_categor 
    WHERE main_category_id = ? AND status = 1
  `;

  try {
    // Execute query
    const [results] = await connection.query(query, [category_id]);

    console.log('Subcategories fetched:', results);

    // If no subcategories found, return a message
    if (results.length === 0) {
      return res.status(404).send({
        message: 'No subcategories found. Please add a subcategory first.',
      });
    }

    // Return the subcategories
    res.status(200).send({
      message: 'Subcategories retrieved successfully',
      subcategories: results,
    });

  } catch (err) {
    console.error('Error fetching subcategories:', err.message);
    res.status(500).send({ message: 'Error fetching subcategories', error: err.message });
  }
};



exports.getAllSubCategories = async (req, res) => {
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

  try {
    // Execute query
    const [results] = await connection.query(query);

    // If no subcategories found
    if (results.length === 0) {
      return res.status(404).send({
        status: 'error',
        message: 'No subcategories found'
      });
    }

    // Return the list of subcategories
    res.status(200).send({
      status: 'success',
      message: 'Subcategories retrieved successfully',
      subcategories: results
    });

  } catch (err) {
    console.error('Error fetching subcategories:', err.message);
    res.status(500).send({
      status: 'error',
      message: 'Error fetching subcategories',
      error: err.message
    });
  }
};




// Function to delete or update category status
exports.deleteCategory = async (req, res) => {
  const { category_id, modified_by, status } = req.body;

  // Validate input fields
  if (!category_id || !modified_by || (status !== 0 && status !== 1)) {
    return res.status(400).send({ message: 'Category ID, modified_by, and valid status (0 or 1) are required' });
  }

  const checkStatusQuery = 'SELECT status FROM main_categor WHERE category_id = ?';

  try {
    // Check current category status
    const [result] = await connection.query(checkStatusQuery, [category_id]);

    if (result.length === 0) {
      return res.status(404).send({ message: 'Category not found' });
    }

    const currentStatus = result[0].status;

    // If no change in status, return message
    if (currentStatus === status) {
      return res.status(400).send({ message: 'No changes happened' });
    }

    // Define status message
    const statusMessage = status === 1 ? 'active' : 'inactive';
    const updateQuery = 'UPDATE main_categor SET modified_by = ?, status = ? WHERE category_id = ?';

    // Update the category status
    const [updateResult] = await connection.query(updateQuery, [modified_by, status, category_id]);

    if (updateResult.affectedRows === 0) {
      return res.status(404).send({ message: 'Category not found' });
    }

    res.status(200).send({ message: `Category updated and status set to ${statusMessage}` });

  } catch (err) {
    console.error('Error updating category:', err.message);
    res.status(500).send({ message: 'Error updating category', error: err.message });
  }
};


// Function to delete or update subcategory status
exports.deleteSubCategory = async (req, res) => {
  const { sub_category_id, modified_by, status } = req.body;

  // Validate input fields
  if (!sub_category_id || !modified_by || (status !== 0 && status !== 1)) {
    return res.status(400).send({ message: 'Subcategory ID, modified_by, and valid status (0 or 1) are required' });
  }

  const checkStatusQuery = 'SELECT status FROM sub_categor WHERE sub_category_id = ?';

  try {
    // Check current subcategory status
    const [result] = await connection.query(checkStatusQuery, [sub_category_id]);

    if (result.length === 0) {
      return res.status(404).send({ message: 'Subcategory not found' });
    }

    const currentStatus = result[0].status;

    // If no change in status, return message
    if (currentStatus === status) {
      return res.status(400).send({ message: 'No changes happened' });
    }

    // Define status message
    const statusMessage = status === 1 ? 'active' : 'inactive';
    const updateQuery = 'UPDATE sub_categor SET modified_by = ?, status = ? WHERE sub_category_id = ?';

    // Update the subcategory status
    const [updateResult] = await connection.query(updateQuery, [modified_by, status, sub_category_id]);

    if (updateResult.affectedRows === 0) {
      return res.status(404).send({ message: 'Subcategory not found' });
    }

    res.status(200).send({ message: `Subcategory status updated to ${statusMessage}` });

  } catch (err) {
    console.error('Error updating subcategory:', err.message);
    res.status(500).send({ message: 'Error updating subcategory', error: err.message });
  }
};

