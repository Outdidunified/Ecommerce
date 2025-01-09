const db=require('../../../config/db');

exports.getAllOrdersForAdmin = (req, res) => {
  const query = `
    SELECT 
      o.order_id,
      o.total_price,
      o.status AS order_status,
      o.created_date, 
      o.tracking_code, -- Add tracking_code to the query
      o.expected_delivery_date,
      p.payment_status,
      p.razorpay_payment_id,  -- Add razorpay_payment_id here
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
          '"product_image": ', JSON_QUOTE(oi.product_image), '}'
        )
      ) AS items
    FROM orders o
    JOIN payments p ON o.order_id = p.order_id
    JOIN delivery_address d ON o.order_id = d.order_id
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN users u ON o.user_id = u.user_id
    GROUP BY o.order_id;
  `;

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch orders for admin', details: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'No orders found' });
    }

    const parsedResult = result.map(order => {
      let formattedCreatedDate = null;

      // Format created_date as "DD Month YYYY"
      if (order.created_date) {
        const createdDate = new Date(order.created_date);
        const day = createdDate.getDate();
        const month = createdDate.toLocaleString('en-US', { month: 'long' });
        const year = createdDate.getFullYear();
        formattedCreatedDate = `${day} ${month} ${year}`;
      }

      let formattedDeliveryDate = null;

      // Show the expected_delivery_date only if the order is confirmed, shipped, out for delivery, or dispatched
      if (
        ['Confirmed', 'Shipped', 'Out for Delivery', 'Dispatched'].includes(order.order_status) && 
        order.expected_delivery_date
      ) {
        const date = new Date(order.expected_delivery_date);
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'long' });
        const year = date.getFullYear();
        formattedDeliveryDate = `${day} ${month} ${year}`;
      }

      const orderResponse = {
        order_id: order.order_id,
        total_price: order.total_price,
        order_status: order.order_status,
        created_date: formattedCreatedDate,  // Include created_date
        expected_delivery_date: formattedDeliveryDate || null,  // Only include if formatted
        payment_status: order.payment_status,
        razorpay_payment_id: order.razorpay_payment_id,  // Include razorpay_payment_id
        user_id: order.user_id,
        username: order.username,
        delivery_name: order.delivery_name,
        contact_number: order.contact_number,
        pincode: order.pincode,
        city: order.city,
        state: order.state,
        house_no: order.house_no,
        road_name: order.road_name,
        // Include tracking_code for confirmed, shipped, out for delivery, or dispatched orders (removed 'Delivered')
        tracking_code: ['Confirmed', 'Shipped', 'Out for Delivery', 'Dispatched'].includes(order.order_status) ? order.tracking_code : null,
        items: order.items ? JSON.parse(`[${order.items}]`) : [], // Parse items JSON
      };

      // Only include expected_delivery_date if the order is confirmed, shipped, out for delivery, or dispatched
      if (formattedDeliveryDate) {
        orderResponse.expected_delivery_date = formattedDeliveryDate;
      }

      // Ensure expected_delivery_date is explicitly excluded for pending or canceled orders
      if (order.order_status === 'Pending' || order.order_status === 'Canceled') {
        delete orderResponse.expected_delivery_date;
      }

      // Parse product details and handle the image path
      orderResponse.items = orderResponse.items.map(item => ({
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        price: item.price,
        total_price: item.total_price,
        product_image: item.product_image ? `/${item.product_image}` : null,  // Handle image path
      }));

      return orderResponse;
    });

    res.json({
      message: 'All orders fetched successfully',
      orders: parsedResult,
    });
  });
};





exports.updateOrderStatusByAdmin = (req, res) => {
  const { order_id, status, expected_delivery_date } = req.body;

  // Allowed statuses
  const allowedStatuses = ['Confirmed', 'Shipped', 'Dispatched', 'Out for Delivery', 'Delivered', 'Canceled'];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid order status' });
  }

  if (!order_id) {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  // Convert date to SQL format if provided
  const formattedDate = expected_delivery_date
    ? new Date(expected_delivery_date.split('-').reverse().join('-')).toISOString().split('T')[0] // DD-MM-YYYY to YYYY-MM-DD
    : null;

  // Step 1: Check if the order's current status is 'Confirmed'
  const checkStatusQuery = `
    SELECT status 
    FROM orders 
    WHERE order_id = ?;
  `;

  db.query(checkStatusQuery, [order_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch order status', details: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const currentStatus = result[0].status;

    // If the current status is not 'Confirmed', deny the update
    if (currentStatus !== 'Confirmed') {
      return res.status(400).json({ error: `Order must be 'Confirmed' to update the expected delivery date.` });
    }

    // Step 2: Proceed to update the status and expected delivery date
    const updateQuery = `
      UPDATE orders 
      SET status = ?, 
          expected_delivery_date = COALESCE(?, expected_delivery_date) 
      WHERE order_id = ?;
    `;

    db.query(updateQuery, [status, formattedDate, order_id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to update order status', details: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json({
        message: `Order status updated to ${status}${formattedDate ? ` with expected delivery date ${formattedDate}` : ''}`,
      });
    });
  });
};

exports.getAllOrdersSummary = (req, res) => {
  // Query to fetch the total orders, pending orders, and customer count for role_id = 1 (admin)
  const query = `
    SELECT 
      COUNT(DISTINCT CASE 
        WHEN o.status NOT IN ('Cancelled', 'Pending') AND o.status IS NOT NULL THEN o.order_id 
        ELSE NULL 
      END) AS total_orders, 

      COUNT(CASE WHEN o.status = 'Pending' THEN 1 ELSE NULL END) AS pending_orders,

      COUNT(DISTINCT CASE 
        WHEN u.role_id = 1 THEN u.user_id 
        ELSE NULL 
      END) AS total_customers  -- Count customers with role_id = 1 (admin)
    FROM users u
    LEFT JOIN orders o ON u.user_id = o.user_id  -- Join the orders table, but count all users
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Failed to fetch order summary:", err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'No users available' });
    }

    // Respond with the order summary for all users
    res.status(200).json({
      message: 'Order summary for all users fetched successfully',
      order_summary: result[0], // Contains total_orders, pending_orders, and total_admins
    });
  });
};
