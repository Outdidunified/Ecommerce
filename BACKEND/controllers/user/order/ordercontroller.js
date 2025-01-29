const db = require('../../../config/db');
const razorpay = require('razorpay'); // Razorpay Node.js SDK
const crypto = require('crypto'); // For generating signature

// Razorpay instance
const razorpayInstance = new razorpay({
  key_id: 'rzp_test_oHoZ3Q1fF6pYEI',
  key_secret: 'Q9FQHLJGtA8knQPOmdTr7vpK'
});

exports.placeorderfromcart = async (req, res) => {
  const { user_id, delivery_address } = req.body;
  
  // Destructure delivery address fields
  const { name, contact_number, pincode, city, state, house_no, road_name } = delivery_address;

  // Log request body for debugging
  console.log("Request Body:", req.body);

  try {
    // Fetch cart items
    const fetchCartQuery = `
      SELECT c.cart_id, c.product_id, c.quantity, p.price, p.product_name, p.image AS product_image
      FROM cart c
      JOIN product p ON c.product_id = p.product_id
      WHERE c.user_id = ?
    `;

    const [cartItems] = await db.query(fetchCartQuery, [user_id]);

    if (cartItems.length === 0) {
      console.log("Cart is empty for user_id:", user_id);
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate total price
    let totalPrice = 0;
    cartItems.forEach(item => {
      totalPrice += item.price * item.quantity;
    });
    totalPrice = parseFloat(totalPrice.toFixed(2)); // Round to 2 decimals
    console.log("Total Price Calculated:", totalPrice);

    // Create order
    const createOrderQuery = `
      INSERT INTO orders (user_id, total_price)
      VALUES (?, ?)
    `;

    const [orderResult] = await db.query(createOrderQuery, [user_id, totalPrice]);
    const order_id = orderResult.insertId;
    console.log("Order Created with ID:", order_id);

    // Add items to order_items table
    const insertOrderItemsQuery = `
      INSERT INTO order_items (order_id, product_id, product_name, product_image, quantity, price, total_price)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    for (let item of cartItems) {
      await db.query(insertOrderItemsQuery, [
        order_id, item.product_id, item.product_name, item.product_image,
        item.quantity, item.price, item.price * item.quantity
      ]);
    }
    console.log("Order items added for order_id:", order_id);

    // Insert the delivery address
    const insertDeliveryAddressQuery = `
      INSERT INTO delivery_address (user_id, order_id, name, contact_number, pincode, city, state, house_no, road_name)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(insertDeliveryAddressQuery, [
      user_id, order_id, name, contact_number, pincode, city, state, house_no, road_name
    ]);
    console.log("Delivery address added for order_id:", order_id);

    // Generate Razorpay Payment Order
    const paymentOrderOptions = {
      amount: totalPrice * 100, // Convert INR to paise
      currency: 'INR',
      receipt: `order_rcptid_${order_id}`,
      payment_capture: 1
    };

    const paymentOrder = await razorpayInstance.orders.create(paymentOrderOptions);
    console.log("Razorpay Payment Order Created:", paymentOrder);

    // Generate payment signature
    const body = paymentOrder.id + "|" + order_id;
    const generatedSignature = crypto.createHmac('sha256', razorpayInstance.key_secret)
      .update(body)
      .digest('hex');
    console.log("Generated Signature:", generatedSignature);

    // Save Razorpay payment info
    const insertPaymentQuery = `
      INSERT INTO payments (order_id, payment_method, payment_status, razorpay_payment_id, razorpay_signature, amount)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await db.query(insertPaymentQuery, [
      order_id, 'Razorpay', 'Pending', paymentOrder.id, generatedSignature, totalPrice
    ]);
    console.log("Payment info saved for order_id:", order_id);

    // Return success response
    return res.json({
      message: 'Order created',
      order_id,
      totalPrice,
      delivery_address: { name, contact_number, pincode, city, state, house_no, road_name },
      payment_order: paymentOrder,
      payment_signature: generatedSignature
    });

  } catch (err) {
    console.error("Error placing order:", err);
    return res.status(500).json({ error: 'Failed to place order', details: err.message });
  }
};



exports.paymentsuccess = async (req, res) => {
  const { razorpay_payment_id, order_id, razorpay_signature, user_id } = req.body;

  console.log("Payment Success Request Body:", req.body); // Log incoming request body

  try {
    // Verify payment signature
    const crypto = require('crypto');
    const body = razorpay_payment_id + "|" + order_id;
    const expectedSignature = crypto.createHmac('sha256', 'Q9FQHLJGtA8knQPOmdTr7vpK')
      .update(body)
      .digest('hex');

    console.log("Expected Signature:", expectedSignature);
    console.log("Provided Signature:", razorpay_signature);

    if (expectedSignature !== razorpay_signature) {
      console.error("Payment signature mismatch for payment_id:", razorpay_payment_id);
      return res.status(400).json({ error: 'Payment signature mismatch' });
    }

    // Update payment status in DB
    const updatePaymentStatusQuery = 'UPDATE payments SET payment_status = ? WHERE razorpay_payment_id = ?';
    await db.query(updatePaymentStatusQuery, ['Completed', razorpay_payment_id]);
    console.log("Payment status updated to 'Completed' for payment_id:", razorpay_payment_id);

    // Generate tracking code and update order status
    const trackingCode = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const updateOrderStatusQuery = 'UPDATE orders SET status = ?, tracking_code = ? WHERE order_id = ?';
    await db.query(updateOrderStatusQuery, ['Confirmed', trackingCode, order_id]);

    // Clear the user's cart after payment
    const clearCartQuery = 'DELETE FROM cart WHERE user_id = ?';
    await db.query(clearCartQuery, [user_id]);
    console.log("Cart cleared for user_id:", user_id);

    // Return success response
    return res.json({ message: 'Payment successful, order confirmed, and cart cleared' });

  } catch (err) {
    console.error('Error during payment success process:', err);
    return res.status(500).json({ error: 'Error processing payment success', details: err.message });
  }
};

exports.failure = async (req, res) => {
  const { razorpay_payment_id, order_id } = req.body;

  try {
    // Update payment status in DB
    const updatePaymentStatusQuery = 'UPDATE payments SET payment_status = ? WHERE razorpay_payment_id = ?';
    await db.query(updatePaymentStatusQuery, ['Incomplete', razorpay_payment_id]);
    console.log("Payment status updated to 'Incomplete' for payment_id:", razorpay_payment_id);

    // Update order status
    const updateOrderStatusQuery = 'UPDATE orders SET status = ? WHERE order_id = ?';
    await db.query(updateOrderStatusQuery, ['payment-failure', order_id]);
    console.log("Order status updated to 'payment-failure' for order_id:", order_id);

    // Return failure response
    return res.json({ message: 'Payment failed and order canceled' });

  } catch (err) {
    console.error("Error during payment failure process:", err);
    return res.status(500).json({ error: 'An error occurred while processing the payment failure', details: err.message });
  }
};

exports.getOrderDetailsForUser = async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const query = `
    SELECT 
      o.order_id,
      o.total_price,
      o.status AS order_status,
      o.tracking_code,
      o.created_date,
      o.expected_delivery_date,
      p.payment_status,
      p.razorpay_payment_id,
      d.name AS user_name,
      d.contact_number,
      d.pincode,
      d.city,
      d.state,
      d.house_no,
      d.road_name,
      GROUP_CONCAT(
        CONCAT(
          '{"product_id": ', oi.product_id, ', ',
          '"product_name": ', JSON_QUOTE(oi.product_name), ', ',
          '"quantity": ', oi.quantity, ', ',
          '"price": ', oi.price, ', ',
          '"total_price": ', oi.total_price, ', ',
          '"product_image": ', JSON_QUOTE(oi.product_image), '}'
        )
        SEPARATOR ',' 
      ) AS items
    FROM orders o
    JOIN payments p ON o.order_id = p.order_id
    JOIN delivery_address d ON o.order_id = d.order_id
    JOIN order_items oi ON o.order_id = oi.order_id
    WHERE o.user_id = ? 
      AND o.status NOT IN ('Pending', 'Cancelled') 
      AND p.payment_status = 'Completed'
    GROUP BY o.order_id;
  `;

  try {
    // Await the query result
    const [result] = await db.query(query, [user_id]);

    if (result.length === 0) {
      return res.status(404).json({ error: 'No orders found for the user with completed payment status' });
    }

    // Map the results to the desired format
    const parsedResult = result.map(order => {
      let formattedCreatedDate = null;

      // Format created_date as "DD/MM/YYYY"
      if (order.created_date) {
        const createdDate = new Date(order.created_date);
        formattedCreatedDate = `${createdDate.getDate().toString().padStart(2, '0')}/${(createdDate.getMonth() + 1)
          .toString()
          .padStart(2, '0')}/${createdDate.getFullYear()}`;
      }

      let formattedDeliveryDate = null;

      // Format expected_delivery_date as "DD/MM/YYYY"
      if (order.expected_delivery_date) {
        const date = new Date(order.expected_delivery_date);
        formattedDeliveryDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')}/${date.getFullYear()}`;
      }

      // Parse items field into an array of objects
      const items = order.items ? JSON.parse(`[${order.items}]`) : [];

      // Map the order response into the desired structure
      const orderResponse = {
        order_id: order.order_id,
        total_price: order.total_price,
        order_status: order.order_status,
        created_date: formattedCreatedDate,
        expected_delivery_date: formattedDeliveryDate,
        payment_status: order.payment_status,
        razorpay_payment_id: order.razorpay_payment_id,
        user_name: order.user_name,
        contact_number: order.contact_number,
        pincode: order.pincode,
        city: order.city,
        state: order.state,
        house_no: order.house_no,
        road_name: order.road_name,
        tracking_code: order.tracking_code,
        items: items.map(item => ({
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          price: item.price,
          total_price: item.total_price,
          product_image: item.product_image ? `/${item.product_image}` : null,
        })),
      };

      return orderResponse;
    });

    // Return the successfully fetched orders
    return res.json({
      message: 'Order details with completed payments fetched successfully',
      orders: parsedResult,
    });

  } catch (err) {
    console.error("Error fetching order details:", err);
    return res.status(500).json({ error: 'Failed to fetch order details', details: err.message });
  }
};






exports.buynow = async (req, res) => {
  const { user_id, product_id, quantity, delivery_address } = req.body;

  // Destructure delivery address fields
  const { name, contact_number, pincode, city, state, house_no, road_name } = delivery_address;

  try {
    // Fetch product details
    const fetchProductQuery = `SELECT price FROM product WHERE product_id = ?`;
    const [product] = await db.query(fetchProductQuery, [product_id]);

    if (product.length === 0) {
      return res.status(400).json({ error: 'Product not found' });
    }

    const totalPrice = product[0].price * quantity;

    // Create Order
    const trackingCode = 'TRACK' + Math.floor(Math.random() * 1000); // Example format: TRACK<random_number>

    const createOrderQuery = `
      INSERT INTO orders (user_id, total_price, tracking_code)
      VALUES (?, ?, ?)
    `;
    const [orderResult] = await db.query(createOrderQuery, [user_id, totalPrice, trackingCode]);

    const order_id = orderResult.insertId;
    console.log("Order Created with ID:", order_id);

    // Add item to order_items
    const insertOrderItemQuery = `
      INSERT INTO order_items (order_id, product_id, quantity, price, total_price)
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.query(insertOrderItemQuery, [order_id, product_id, quantity, product[0].price, totalPrice]);

    // Save delivery address for the order
    const insertDeliveryAddressQuery = `
      INSERT INTO delivery_address 
      (user_id, order_id, name, contact_number, pincode, city, state, house_no, road_name) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db.query(insertDeliveryAddressQuery, [user_id, order_id, name, contact_number, pincode, city, state, house_no, road_name]);

    // Generate Razorpay Payment Order
    const paymentOrderOptions = {
      amount: totalPrice * 100, // Amount in paise
      currency: 'INR',
      receipt: `order_rcptid_${order_id}`,
      payment_capture: 1
    };

    razorpayInstance.orders.create(paymentOrderOptions, async (err, paymentOrder) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to create payment order' });
      }

      // Save Razorpay Payment info in payments table
      const insertPaymentQuery = `
        INSERT INTO payments (order_id, payment_method, payment_status, razorpay_payment_id, amount)
        VALUES (?, ?, ?, ?, ?)
      `;
      await db.query(insertPaymentQuery, [order_id, 'Razorpay', 'Pending', paymentOrder.id, totalPrice]);

      res.json({
        message: 'Order created successfully',
        order_id,
        totalPrice,
        payment_order: paymentOrder,
        delivery_address: {
          name, contact_number, pincode, city, state, house_no, road_name
        }
      });
    });
  } catch (err) {
    console.error("Error processing buy now:", err);
    return res.status(500).json({ error: 'Failed to process order', details: err.message });
  }
};

