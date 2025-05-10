const db = require('../../../config/db');
exports.addtocart = async (req, res) => {
  // Extract user_id from the authenticated user's token
  const user_id = req.user.user_id; // Provided by the `authenticate` middleware
  const { product_id, quantity } = req.body;

  // Validate input
  if (!product_id || !quantity) {
    return res.status(400).send({ error:true,message: 'product_id and quantity are required' });
  }

  try {
    // Fetch the current stock quantity of the product
    const [productResult] = await db.query(
      'SELECT quantity FROM product WHERE product_id = ?',
      [product_id]
    );

    if (productResult.length === 0) {
      return res.status(404).send({error:true, message: 'Product not found' });
    }

    const availableQuantity = productResult[0].quantity;

    // Check if the product is out of stock
    if (availableQuantity === 0) {
      return res.status(400).send({error:true, message: 'Product is out of stock' });
    }

    // Check if the requested quantity exceeds the available quantity
    if (quantity > availableQuantity) {
      return res
        .status(400)
        .send({ error:true,message: `Available Quantity for this product is${availableQuantity}` });
    }

    // Check if the product already exists in the user's cart
    const [checkResult] = await db.query(
      'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
      [user_id, product_id]
    );

    // If the product already exists in the cart, return an error
    if (checkResult.length > 0) {
      return res.status(400).send({error:true, message: 'Product already exists in cart' });
    }

    // Insert the product into the cart
    await db.query(
      'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
      [user_id, product_id, quantity]
    );

    res.status(200).send({ error:false,message: 'Product added to cart successfully' });
  } catch (err) {
    return res.status(500).send({ error:true,message: 'Error adding to cart', error: err.message });
  }
};


exports.getcart = async (req, res) => {
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

  try {
    // Perform the query and await the result
    const [results] = await db.query(query, [user_id]);

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
      error:false,
      message: 'Cart retrieved successfully',
      cart: cartItems,
    });
  } catch (err) {
    return res.status(500).json({error:true, message: 'Error fetching cart', error: err.message });
  }
};


exports.updateCart = async (req, res) => {
  // Extract user_id from the authenticated user's token
  const user_id = req.user.user_id; // Provided by the `authenticate` middleware
  const { product_id, quantity } = req.body;

  // Validate input
  if (!product_id || !quantity) {
    return res.status(400).send({ error:true,message: 'product_id and quantity are required' });
  }

  try {
    // Fetch the current stock quantity of the product
    const [productResult] = await db.query('SELECT quantity FROM product WHERE product_id = ?', [product_id]);

    if (productResult.length === 0) {
      return res.status(404).send({ error:true,message: 'Product not found' });
    }

    const availableQuantity = productResult[0].quantity;

    // Check if the requested quantity exceeds the available quantity
    if (quantity < 1) {
      return res.status(400).send({ error:true,message: 'Quantity cannot be less than 1' });
    }

    // Check if the product exists in the user's cart
    const [checkResult] = await db.query('SELECT * FROM cart WHERE user_id = ? AND product_id = ?', [user_id, product_id]);

    // If the product exists, update the quantity, otherwise add it to the cart
    if (checkResult.length > 0) {
      // Update the quantity directly to the requested quantity (instead of adding to the current one)
      if (quantity > availableQuantity) {
        return res.status(400).send({ error:true,message: `Available Quantity  of this product is ${availableQuantity}` });
      }

      // Update the quantity in the cart
      const [updateResult] = await db.query('UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?', [quantity, user_id, product_id]);

      if (updateResult.affectedRows > 0) {
        return res.status(200).send({error:false, message: 'Cart updated successfully' });
      } else {
        return res.status(400).send({error:true, message: 'Failed to update cart' });
      }
    } else {
      // If the product does not exist in the cart, add it to the cart
      if (quantity > availableQuantity) {
        return res.status(400).send({ error:true,message: `You can only add up to ${availableQuantity} units for this product` });
      }

      // Insert new product into the cart
      const [insertResult] = await db.query('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)', [user_id, product_id, quantity]);

      if (insertResult.affectedRows > 0) {
        return res.status(200).send({ error:false,message: 'Product added to cart successfully' });
      } else {
        return res.status(400).send({ error:true,message: 'Failed to add product to cart' });
      }
    }
  } catch (err) {
    return res.status(500).send({ error:true,message: 'Error updating cart', error: err.message });
  }
};



exports.removefromcart = async (req, res) => {
  const user_id = req.user.user_id; // Extract user_id from the token
  const { product_id } = req.body;

  if (!product_id) {
    return res.status(400).json({ error:true,message: 'product_id is required' });
  }

  const query = `DELETE FROM cart WHERE user_id = ? AND product_id = ?`;

  try {
    const [result] = await db.query(query, [user_id, product_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error:true,message: 'Cart item not found' });
    }

    res.status(200).json({error:false, message: 'Product removed from cart successfully' });
  } catch (err) {
    return res.status(500).json({ error:true,message: 'Error removing from cart', error: err.message });
  }
};

  