const db = require('../../../config/db');

// Function to get all orders for admin
exports.getAllOrdersForAdmin = async (req, res) => {
  const query = `
    SELECT
      o.order_id,
      o.total_price,
      o.status AS order_status,
      o.created_date,
      o.tracking_code,
      o.expected_delivery_date,
      p.payment_status,
      p.razorpay_payment_id,
      u.user_id,
      u.username AS username,  
      d.name AS delivery_name,
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
          '"product_image": ', JSON_QUOTE(COALESCE(oi.product_image, '')), '}'
        )
      ) AS items
    FROM orders o
    JOIN payments p ON o.order_id = p.order_id
    JOIN delivery_address d ON o.order_id = d.order_id
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN users u ON o.user_id = u.user_id
    WHERE p.payment_status != 'Pending' -- Exclude orders with "Pending" payment status
    GROUP BY o.order_id;
  `;

  try {
    // Query the database
    const [result] = await db.query(query);

    if (result.length === 0) {
      console.log('No orders found');
      return res.status(404).json({ error: 'No orders found' });
    }

    const parsedResult = result.map(order => {
      let formattedCreatedDate = null;

      if (order.created_date) {
        const createdDate = new Date(order.created_date);
        formattedCreatedDate = `${createdDate.getDate().toString().padStart(2, '0')}/${(createdDate.getMonth() + 1)
          .toString()
          .padStart(2, '0')}/${createdDate.getFullYear()}`;
      }

      let formattedDeliveryDate = null;

      if (
        ['Confirmed', 'Shipped', 'Out for Delivery', 'Dispatched', 'Delivered'].includes(order.order_status)
      ) {
        if (order.expected_delivery_date) {
          const deliveryDate = new Date(order.expected_delivery_date);
          formattedDeliveryDate = `${deliveryDate.getDate().toString().padStart(2, '0')}/${(deliveryDate.getMonth() + 1)
            .toString()
            .padStart(2, '0')}/${deliveryDate.getFullYear()}`;
        }
      }

      const orderResponse = {
        order_id: order.order_id,
        total_price: order.total_price,
        order_status: order.order_status,
        created_date: formattedCreatedDate,
        expected_delivery_date: formattedDeliveryDate,
        payment_status: order.payment_status,
        razorpay_payment_id: order.razorpay_payment_id,
        user_id: order.user_id,
        username: order.username,
        delivery_name: order.delivery_name,
        contact_number: order.contact_number,
        pincode: order.pincode,
        city: order.city,
        state: order.state,
        house_no: order.house_no,
        road_name: order.road_name,
        tracking_code: ['Confirmed', 'Shipped', 'Out for Delivery', 'Dispatched', 'Delivered'].includes(order.order_status) ? order.tracking_code : null,
        items: order.items ? JSON.parse(`[${order.items}]`) : [],
      };

      // Remove expected_delivery_date for certain statuses
      if (['Pending', 'Canceled', 'Payment-failure'].includes(order.order_status)) {
        delete orderResponse.expected_delivery_date;
      }

      // Map over items to add product image URL if available
      orderResponse.items = orderResponse.items.map(item => ({
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        price: item.price,
        total_price: item.total_price,
        product_image: item.product_image ? `/${item.product_image.replace(/\\/g, '/')}` : null, // Ensure proper URL formatting
      }));

      return orderResponse;
    });

    res.status(200).json({
      message: 'All orders fetched successfully',
      orders: parsedResult,
    });
  } catch (err) {
    console.error('Database query error:', err); // Log the error
    res.status(500).json({ error: 'Failed to fetch orders for admin', details: err });
  }
};


exports.updateOrderStatusByAdmin = async (req, res) => {
  const { order_id, status, expected_delivery_date, modified_by } = req.body;

  const allowedStatuses = ['Confirmed', 'Shipped', 'Dispatched', 'Out for Delivery', 'Delivered'];

  // Validate input
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid order status' });
  }
  if (!order_id) {
    return res.status(400).json({ error: 'Order ID is required' });
  }
  if (!modified_by) {
    return res.status(400).json({ error: 'Modified by is required' });
  }

  // Validate expected delivery date format
  let formattedDate = null;
  if (expected_delivery_date) {
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (dateRegex.test(expected_delivery_date)) {
      const [day, month, year] = expected_delivery_date.split('/');
      formattedDate = `${year}-${month}-${day}`; // converting to YYYY-MM-DD format
      const dateObj = new Date(formattedDate);
      if (isNaN(dateObj)) {
        return res.status(400).json({ error: 'Invalid date format. Could not parse date.' });
      }
    } else {
      return res.status(400).json({ error: 'Invalid date format. Expected format: DD/MM/YYYY' });
    }
  }

  try {
    // Query to check the order status and payment status
    const checkStatusQuery = `
      SELECT o.status, o.expected_delivery_date, p.payment_status 
      FROM orders o
      LEFT JOIN payments p ON o.order_id = p.order_id
      WHERE o.order_id = ?;
    `;

    const [result] = await db.query(checkStatusQuery, [order_id]);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const currentStatus = result[0].status;
    const currentExpectedDeliveryDate = result[0].expected_delivery_date;
    const paymentStatus = result[0].payment_status;

    // Check if payment is completed
    if (paymentStatus !== 'Completed') {
      return res.status(400).json({ error: 'Order cannot be updated as payment is not confirmed.' });
    }

    // Prevent updates if the order is already delivered
    if (currentStatus === 'Delivered') {
      return res.status(400).json({ error: 'Order cannot be updated after being delivered.' });
    }

    // Allow update if only the expected_delivery_date has changed
    const isStatusChanged = status !== currentStatus;
    const isDeliveryDateChanged = formattedDate !== currentExpectedDeliveryDate;

    // If neither status nor delivery date changed, return an error
    if (!isStatusChanged && !isDeliveryDateChanged) {
      return res.status(400).json({ error: 'No changes happened' });
    }

    // Update query
    const updateQuery = `
      UPDATE orders 
      SET 
        status = ?, 
        expected_delivery_date = COALESCE(?, expected_delivery_date), 
        modified_by = ? 
      WHERE order_id = ?;
    `;

    const [updateResult] = await db.query(updateQuery, [status, formattedDate, modified_by, order_id]);

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({
      message: `Order status updated to ${status}${formattedDate ? ` with expected delivery date ${expected_delivery_date}` : ''}`,
    });

  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({ error: 'Failed to update order status', details: err });
  }
};



exports.getAllOrdersSummary = async (req, res) => {
  const query = `
    SELECT 
      COUNT(DISTINCT CASE 
        WHEN o.status IN ('Confirmed', 'Shipped', 'Out for Delivery', 'Dispatched', 'Delivered') THEN o.order_id
        ELSE NULL 
      END) AS total_orders, 
      COUNT(DISTINCT CASE 
        WHEN p.payment_status = 'Incomplete' THEN o.order_id 
        ELSE NULL 
      END) AS pending_orders, 
      COUNT(DISTINCT CASE 
        WHEN u.role_id = 1 THEN u.user_id 
        ELSE NULL 
      END) AS total_customers, 
      (SELECT COUNT(*) FROM product) AS total_products
    FROM users u
    LEFT JOIN orders o ON u.user_id = o.user_id
    LEFT JOIN payments p ON o.order_id = p.order_id
    WHERE u.role_id = 1  -- Ensuring only users with role_id = 1 are considered
  `;

  try {
    const [result] = await db.query(query);

    if (result.length === 0) {
      console.log('No data available');
      return res.status(404).json({ message: 'No data available' });
    }

    res.status(200).json({
      message: 'Order summary fetched successfully',
      order_summary: result[0],  // Contains total_orders, pending_orders, total_customers, and total_products
    });
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({ error: 'Database error' });
  }
};





