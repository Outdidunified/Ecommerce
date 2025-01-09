const db=require('../../../config/db');
exports.getAllOrdersForAdmin = (req, res) => {
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
        ['Confirmed', 'Shipped', 'Out for Delivery', 'Dispatched', 'Delivered'].includes(order.order_status)
      ) {
        if (order.expected_delivery_date) {
          const date = new Date(order.expected_delivery_date);
          formattedDeliveryDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}/${date.getFullYear()}`;
        } else {
          formattedDeliveryDate = null;
        }
      }

      const orderResponse = {
        order_id: order.order_id,
        total_price: order.total_price,
        order_status: order.order_status,
        created_date: formattedCreatedDate, // Include formatted created_date
        expected_delivery_date: formattedDeliveryDate, // Include formatted expected_delivery_date
        payment_status: order.payment_status,
        razorpay_payment_id: order.razorpay_payment_id, // Include razorpay_payment_id
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

        items: order.items ? JSON.parse(`[${order.items}]`) : [], // Parse items JSON
      };

      // Exclude expected_delivery_date for Pending or Canceled orders
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
        product_image: item.product_image ? `/${item.product_image}` : null, // Handle image path
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
  const { order_id, status, expected_delivery_date, modified_by } = req.body;

  // Allowed statuses
  const allowedStatuses = ['Confirmed', 'Shipped', 'Dispatched', 'Out for Delivery', 'Delivered'];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid order status' });
  }

  if (!order_id) {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  if (!modified_by) {
    return res.status(400).json({ error: 'Modified by is required' });
  }

  // Convert expected_delivery_date if provided, handle format DD/MM/YYYY
  let formattedDate = null;
  if (expected_delivery_date) {
    // Regex to validate the DD/MM/YYYY format
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (dateRegex.test(expected_delivery_date)) {
      const [day, month, year] = expected_delivery_date.split('/'); // Extract day, month, year
      formattedDate = `${year}-${month}-${day}`; // Convert to YYYY-MM-DD format

      // Validate the formatted date
      const dateObj = new Date(formattedDate);
      if (isNaN(dateObj)) {
        return res.status(400).json({ error: 'Invalid date format. Could not parse date.' });
      }
    } else {
      return res.status(400).json({ error: 'Invalid date format. Expected format: DD/MM/YYYY' });
    }
  }

  // Step 1: Check if the order's current status is valid for the update
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

    // Allow status updates unless the order is already delivered
    if (currentStatus === 'Delivered') {
      return res.status(400).json({ error: 'Order cannot be updated after being delivered.' });
    }

    // Step 2: Proceed to update the status, expected delivery date, and modified_by field
    const updateQuery = `
      UPDATE orders 
      SET 
        status = ?, 
        expected_delivery_date = COALESCE(?, expected_delivery_date), 
        modified_by = ? 
      WHERE order_id = ?;
    `;

    db.query(updateQuery, [status, formattedDate, modified_by, order_id], (err, result) => {
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
  // Query to fetch the total orders, pending orders, customer count, and total products with status = 1
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
      END) AS total_customers,  -- Count customers with role_id = 1 (admin)

      (SELECT COUNT(*) FROM product WHERE status = 1) AS total_products  -- Count total products with status = 1
    FROM users u
    LEFT JOIN orders o ON u.user_id = o.user_id
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Failed to fetch order summary:", err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'No data available' });
    }

    // Respond with the order summary
    res.status(200).json({
      message: 'Order summary fetched successfully',
      order_summary: result[0], // Contains total_orders, pending_orders, total_customers, and total_products
    });
  });
};
