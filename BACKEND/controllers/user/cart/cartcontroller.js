const db=require('../../../config/db');
exports.addtocart = (req, res) => {
    // Extract user_id from the authenticated user's token
    const user_id = req.user.user_id; // Provided by the `authenticate` middleware
    const { product_id, quantity } = req.body;
  
    // Validate input
    if (!product_id || !quantity) {
      return res.status(400).send({ message: 'product_id and quantity are required' });
    }
  
    // Check if the product already exists in the user's cart
    const checkQuery = 'SELECT * FROM cart WHERE user_id = ? AND product_id = ?';
    db.query(checkQuery, [user_id, product_id], (err, result) => {
      if (err) {
        return res.status(500).send({ message: 'Error checking cart', error: err.message });
      }
  
      // If the product already exists in the cart, do not allow adding it
      if (result.length > 0) {
        return res.status(400).send({ message: 'Product already exists in cart' });
      }
  
      // Insert the product into the cart if it doesn't already exist
      const query = `
        INSERT INTO cart (user_id, product_id, quantity)
        VALUES (?, ?, ?);
      `;
  
      db.query(query, [user_id, product_id, quantity], (err, result) => {
        if (err) {
          return res.status(500).send({ message: 'Error adding to cart', error: err.message });
        }
        res.status(200).send({ message: 'Product added to cart successfully' });
      });
    });
  };
  
  exports.getcart = (req, res) => {
    const user_id = req.user.user_id; // Extract user_id from the token
  
    const query = `
      SELECT 
        c.cart_id, 
        c.product_id, 
        c.quantity, 
        p.product_name, 
        p.price, 
        p.unit, 
        p.image, 
        p.image2, 
        p.description,
        p.exchangable,  -- Add exchangeable field
        p.refundable     -- Add refundable field
      FROM cart c
      JOIN product p ON c.product_id = p.product_id
      WHERE c.user_id = ?
    `;
  
    db.query(query, [user_id], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching cart', error: err.message });
      }
  
      // Process each cart item and recalculate total_price based on current product price
      const cartItems = results.map(item => {
        const total_price = item.price * item.quantity; // Recalculate total price
  
        return {
          cart_id: item.cart_id,
          product_id: item.product_id,
          quantity: item.quantity,
          product_name: item.product_name,
          description: item.description,
          unit: item.unit,
          total_price: total_price,  // Include recalculated total price
          image: item.image ? `/${item.image}` : null,  // Only add the image path if image exists
          image2: item.image2 ? `/${item.image2}` : null,  // Similarly for image2
          exchangable: item.exchangable ? true : false,  // Add exchangeable status
          refundable: item.refundable ? true : false,      // Add refundable status
        };
      });
  
      res.status(200).json({
        message: 'Cart retrieved successfully',
        cart: cartItems,
      });
    });
  };
  

exports.updatecart = (req, res) => {
  const user_id = req.user.user_id; // Extract user_id from the token
  const { product_id, quantity } = req.body;

  if (!product_id || !quantity) {
    return res.status(400).json({ message: 'product_id and quantity are required' });
  }

  const query = `UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?`;

  db.query(query, [quantity, user_id, product_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating cart', error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.status(200).json({ message: 'Cart updated successfully' });
  });
};

exports.removefromcart = (req, res) => {
    const user_id = req.user.user_id; // Extract user_id from the token
    const { product_id } = req.body;
  
    if (!product_id) {
      return res.status(400).json({ message: 'product_id is required' });
    }
  
    const query = `DELETE FROM cart WHERE user_id = ? AND product_id = ?`;
  
    db.query(query, [user_id, product_id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error removing from cart', error: err.message });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Cart item not found' });
      }
  
      res.status(200).json({ message: 'Product removed from cart successfully' });
    });
  };
  