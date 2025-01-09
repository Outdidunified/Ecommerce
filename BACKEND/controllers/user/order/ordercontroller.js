const db=require('../../../config/db');
const razorpay = require('razorpay'); // Razorpay Node.js SDK

// Razorpay instance
const razorpayInstance = new razorpay({
  key_id: 'rzp_test_oHoZ3Q1fF6pYEI',
  key_secret: 'Q9FQHLJGtA8knQPOmdTr7vpK'
}); 

exports.placeorderfromcart = (req, res) => {
  const { user_id, delivery_address } = req.body;

  // Destructure delivery address fields
  const { name, contact_number, pincode, city, state, house_no, road_name } = delivery_address;

  // Log request body for debugging
  console.log("Request Body:", req.body);

  // Fetch cart items
  const fetchCartQuery = `
    SELECT c.cart_id, c.product_id, c.quantity, p.price, p.product_name, p.image AS product_image
    FROM cart c
    JOIN product p ON c.product_id = p.product_id
    WHERE c.user_id = ?
  `;

  db.query(fetchCartQuery, [user_id], (err, cartItems) => {
    if (err) {
      console.error("Error fetching cart items:", err);
      return res.status(500).json({ error: 'Failed to fetch cart items' });
    }

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

    // Create order (without tracking code for now)
    const createOrderQuery = `
      INSERT INTO orders (user_id, total_price)
      VALUES (?, ?)
    `;

    db.query(createOrderQuery, [user_id, totalPrice], (err, result) => {
      if (err) {
        console.error("Error creating order:", err);
        return res.status(500).json({ error: 'Failed to create order', details: err });
      }

      const order_id = result.insertId;
      console.log("Order Created with ID:", order_id);

      // Add items to order_items table
      cartItems.forEach(item => {
        const insertOrderItemQuery = `
          INSERT INTO order_items (order_id, product_id, product_name, product_image, quantity, price, total_price)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(insertOrderItemQuery, [order_id, item.product_id, item.product_name, item.product_image, item.quantity, item.price, item.price * item.quantity]);
      });
      console.log("Order items added for order_id:", order_id);

      // Insert the delivery address
      const insertDeliveryAddressQuery = `
        INSERT INTO delivery_address (user_id, order_id, name, contact_number, pincode, city, state, house_no, road_name)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(insertDeliveryAddressQuery, [user_id, order_id, name, contact_number, pincode, city, state, house_no, road_name], (err) => {
        if (err) {
          console.error("Error adding delivery address:", err);
          return res.status(500).json({ error: 'Failed to add delivery address' });
        }
        console.log("Delivery address added for order_id:", order_id);

        // Generate Razorpay Payment Order
        const paymentOrderOptions = {
          amount: totalPrice * 100, // Convert INR to paise
          currency: 'INR',
          receipt: `order_rcptid_${order_id}`,
          payment_capture: 1
        };

        razorpayInstance.orders.create(paymentOrderOptions, (err, paymentOrder) => {
          if (err) {
            console.error("Error creating Razorpay payment order:", err);
            return res.status(500).json({ error: 'Failed to create payment order' });
          }
          console.log("Razorpay Payment Order Created:", paymentOrder);

          // Generate payment signature
          const crypto = require('crypto');
          const body = paymentOrder.id + "|" + order_id;
          const generatedSignature = crypto.createHmac('sha256', 'Q9FQHLJGtA8knQPOmdTr7vpK')
            .update(body)
            .digest('hex');
          console.log("Generated Signature:", generatedSignature);

          // Save Razorpay payment info
          const insertPaymentQuery = `
            INSERT INTO payments (order_id, payment_method, payment_status, razorpay_payment_id, razorpay_signature, amount)
            VALUES (?, ?, ?, ?, ?, ?)
          `;
          db.query(insertPaymentQuery, [order_id, 'Razorpay', 'Pending', paymentOrder.id, generatedSignature, totalPrice]);
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
        });
      });
    });
  });
};


exports.paymentsuccess = (req, res) => {
  const { razorpay_payment_id, order_id, razorpay_signature, user_id } = req.body;

  console.log("Payment Success Request Body:", req.body); // Log incoming request body

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
  db.query(updatePaymentStatusQuery, ['Completed', razorpay_payment_id], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to update payment status' });
    }
    console.log("Payment status updated to 'Completed' for payment_id:", razorpay_payment_id);

    // Generate tracking code and update order status
    const trackingCode = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const updateOrderStatusQuery = 'UPDATE orders SET status = ?, tracking_code = ? WHERE order_id = ?';
    db.query(updateOrderStatusQuery, ['Confirmed', trackingCode, order_id], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to update order status' });
      }

      // Clear the user's cart after payment
      const clearCartQuery = 'DELETE FROM cart WHERE user_id = ?';
      db.query(clearCartQuery, [user_id], (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to clear cart' });
        }
        console.log("Cart cleared for user_id:", user_id);

        // Return success response
        res.json({ message: 'Payment successful, order confirmed, and cart cleared' });
      });
    });
  });
};

exports.failure= (req, res) => {
  const { razorpay_payment_id, order_id } = req.body;

  // Update payment status in DB
  const updatePaymentStatusQuery = 'UPDATE payments SET payment_status = ? WHERE razorpay_payment_id = ?';
  db.query(updatePaymentStatusQuery, ['Failed', razorpay_payment_id]);

  // Update order status
  const updateOrderStatusQuery = 'UPDATE orders SET status = ? WHERE order_id = ?';
  db.query(updateOrderStatusQuery, ['Canceled', order_id]);

  res.json({ message: 'Payment failed and order canceled' });

};
exports.getOrderDetailsForUser = (req, res) => {
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
    GROUP BY o.order_id;
  `;

  db.query(query, [user_id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch order details', details: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'No orders found for the user' });
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
      if (
        ['Confirmed', 'Shipped', 'Out for Delivery', 'Dispatched', 'Delivered'].includes(order.order_status) &&
        order.expected_delivery_date
      ) {
        const date = new Date(order.expected_delivery_date);
        formattedDeliveryDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')}/${date.getFullYear()}`;
      }

      // Parse items field into an array of objects
      const items = order.items ? JSON.parse(`[${order.items}]`) : [];

      // Check if payment is completed and order is eligible for tracking code
      const showTrackingCode = order.payment_status === 'Completed' && 
        ['Confirmed', 'Shipped', 'Out for Delivery', 'Dispatched', 'Delivered'].includes(order.order_status);

      // Map the order response into the desired structure
      const orderResponse = {
        order_id: order.order_id,
        total_price: order.total_price,
        order_status: order.order_status,
        created_date: formattedCreatedDate, // Include formatted created_date
        expected_delivery_date: formattedDeliveryDate, // Include formatted expected_delivery_date
        payment_status: order.payment_status,
        razorpay_payment_id: order.razorpay_payment_id,
        user_name: order.user_name,
        contact_number: order.contact_number,
        pincode: order.pincode,
        city: order.city,
        state: order.state,
        house_no: order.house_no,
        road_name: order.road_name,
        tracking_code: showTrackingCode ? order.tracking_code : null,  
        items: items.map(item => ({
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          price: item.price,
          total_price: item.total_price,
          product_image: item.product_image ? `/${item.product_image}` : null,
        })),
      };

      // Exclude expected_delivery_date for Pending or Canceled orders
      if (order.order_status === 'Pending' || order.order_status === 'Canceled') {
        delete orderResponse.expected_delivery_date;
      }

      return orderResponse;
    });

    res.json({
      message: 'Order details fetched successfully',
      orders: parsedResult,
    });
  });
};







// Place Order with "Buy Now" and Handle Payment
exports.buynow = (req, res) => {
  const { user_id, product_id, quantity, delivery_address } = req.body;

  // Destructure delivery address fields
  const { name, contact_number, pincode, city, state, house_no, road_name } = delivery_address;

  // Fetch product details
  const fetchProductQuery = `
    SELECT price FROM product WHERE product_id = ?
  `;
  db.query(fetchProductQuery, [product_id], (err, product) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch product details' });
    }

    if (product.length === 0) {
      return res.status(400).json({ error: 'Product not found' });
    }

    const totalPrice = product[0].price * quantity;

    // Create Order
    const trackingCode = 'TRACK' + order_id + Math.floor(Math.random() * 1000); // Example format: TRACK<order_id><random_number>

// Create order with tracking_code
 const createOrderQuery = `
  INSERT INTO orders (user_id, total_price, tracking_code)
  VALUES (?, ?, ?)
`;
db.query(createOrderQuery, [user_id, totalPrice, trackingCode], (err, result) => {
  if (err) {
    console.error("Error creating order:", err);
    return res.status(500).json({ error: 'Failed to create order', details: err });
  }

  const order_id = result.insertId;
  console.log("Order Created with ID:", order_id);
    

      // Add item to order_items
      const insertOrderItemQuery = `
        INSERT INTO order_items (order_id, product_id, quantity, price, total_price)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.query(insertOrderItemQuery, [order_id, product_id, quantity, product[0].price, totalPrice]);

      // Save delivery address for the order
      const insertDeliveryAddressQuery = `
        INSERT INTO delivery_address 
        (user_id, order_id, name, contact_number, pincode, city, state, house_no, road_name) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(insertDeliveryAddressQuery, [user_id, order_id, name, contact_number, pincode, city, state, house_no, road_name], (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to save delivery address' });
        }

        // Generate Razorpay Payment Order
        const paymentOrderOptions = {
          amount: totalPrice * 100, // Amount in paise
          currency: 'INR',
          receipt: `order_rcptid_${order_id}`,
          payment_capture: 1
        };

        razorpayInstance.orders.create(paymentOrderOptions, (err, paymentOrder) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to create payment order' });
          }

          // Save Razorpay Payment info in payments table
          const insertPaymentQuery = `
            INSERT INTO payments (order_id, payment_method, payment_status, razorpay_payment_id, amount)
            VALUES (?, ?, ?, ?, ?)
          `;
          db.query(insertPaymentQuery, [order_id, 'Razorpay', 'Pending', paymentOrder.id, totalPrice]);

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
      });
    });
  });
};

