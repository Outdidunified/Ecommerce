
const db = require('../../config/db');
exports.getCategoryHierarchy = (req, res) => {
    // Query to fetch all categories
    const categoryQuery = 'SELECT * FROM main_categor WHERE status = TRUE';
  
    db.query(categoryQuery, (err, categories) => {
      if (err) {
        return res.status(500).send({ message: 'Error fetching categories', error: err.message });
      }
  
      if (categories.length === 0) {
        return res.status(404).send({ message: 'No categories found' });
      }
  
      const categoryData = [];
  
      // Process each category to fetch its subcategories and products
      const categoryPromises = categories.map((category) => {
        return new Promise((resolve, reject) => {
          const subCategoryQuery = `
            SELECT * FROM sub_categor 
            WHERE main_category_id = ? AND status = TRUE`;
  
          db.query(subCategoryQuery, [category.category_id], (err, subCategories) => {
            if (err) {
              reject({ message: 'Error fetching subcategories', error: err.message });
            } else {
              const subCategoryPromises = subCategories.map((subCategory) => {
                return new Promise((resolveSub, rejectSub) => {
                  const productQuery = `
                    SELECT * FROM product 
                    WHERE category_id = ? AND sub_category_id = ?`;
  
                  db.query(productQuery, [category.category_id, subCategory.sub_category_id], (err, products) => {
                    if (err) {
                      rejectSub({ message: 'Error fetching products', error: err.message });
                    } else {
                      resolveSub({
                        ...subCategory,
                        products
                      });
                    }
                  });
                });
              });
  
              // Wait for all subcategories to fetch their products
              Promise.all(subCategoryPromises)
                .then((subCategoryData) => {
                  categoryData.push({
                    ...category,
                    subcategories: subCategoryData
                  });
                  resolve();
                })
                .catch(reject);
            }
          });
        });
      });
  
      // Wait for all categories to process
      Promise.all(categoryPromises)
        .then(() => {
          res.status(200).send({ categories: categoryData });
        })
        .catch((err) => {
          res.status(500).send({ message: err.message });
        });
    });
  };
  