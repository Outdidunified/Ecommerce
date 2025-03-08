const db = require('../../../config/db');
const jwt = require('jsonwebtoken');
const { EmailConfig } = require('../auth/Email');
const crypto = require('crypto');

exports.signup = async (req, res) => {
  const { username, email_id, password, user_type } = req.body;
  console.log(req.body);

  // Validation for required
  //  fields
  if (!username || !email_id || !password || !user_type) {
    return res.status(400).json({ error: true ,message: 'Username, email, password, and user type are required' });
  }

  try {
    // Handle both admin and user signup based on user_type
    const [roleResult] = await db.query('SELECT role_id FROM roles WHERE role_name = ?', [user_type]);

    if (roleResult.length === 0) {
      return res.status(400).json({error:true, message: `Role "${user_type}" does not exist in the roles table` });
    }

    const role_id = roleResult[0].role_id;

    // Check if the user already exists
    const [existingUser] = await db.query('SELECT * FROM users WHERE email_id = ?', [email_id]);

    if (existingUser.length > 0) {
      return res.status(400).json({ error:true,message: 'User already exists' });
    }

    // Insert the new user into the users table
    const insertQuery = 'INSERT INTO users (username, email_id, password, role_id, user_type) VALUES (?, ?, ?, ?, ?)';
    const [insertResult] = await db.query(insertQuery, [username, email_id, password, role_id, user_type]);

    const user_id = insertResult.insertId;

    res.status(200).json({
      error: false,

    message: `${user_type.charAt(0).toUpperCase() + user_type.slice(1)} registered successfully`,
      user_id,
      username,
      email_id,
      user_type,
    });

  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ error:true,message: 'Internal Server Error', error: err.message });
  }
};


exports.signin = async (req, res) => {
  const { email_id, password } = req.body;
  console.log(req.body);

  // Validation for required fields
  if (!email_id || !password) {
    return res.status(400).json({error:true, message: 'Email and password are required' });
  }

  try {
    // Check if the user exists in the 'users' table
    const [userResult] = await db.query('SELECT * FROM users WHERE email_id = ?', [email_id]);

    if (userResult.length === 0) {
      return res.status(404).json({error:true, message: 'User not found' });
    }

    const user = userResult[0];

    // Check if the user's account is active (active = 1)
    if (user.active === 0) {
      return res.status(403).json({ error:true,message: 'Your account is deactivated.' });
    }

    // Check if the user has role_id = 1 (only role_id = 1 can log in)
    if (user.role_id !== 1) {
      return res.status(403).json({ error:true,message: ' You are not authorized to log in.' });
    }

    // Check if the password matches
    if (password !== user.password) {
      return res.status(401).json({ error:true,message: 'Invalid credentials' });
    }

    // Fetch role name for the user from roles table based on role_id
    const [roleResult] = await db.query('SELECT role_name FROM roles WHERE role_id = ?', [user.role_id]);

    if (roleResult.length === 0) {
      return res.status(400).json({ error:true,message: 'Role not found for user' });
    }

    const role_name = roleResult[0].role_name;

    // Create JWT token (without expiration)
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role_id },
      process.env.JWT_SECRET
    );

    console.log('JWT Token:', token); // Log the token

    res.status(200).json({
      error:false,
      message: 'Sign in successful',
      token,
      user_id: user.user_id,
      username: user.username,
      email_id: user.email_id,
      role_name,
      role_id: user.role_id,
      user_type: user.user_type,
    });

  } catch (err) {
    console.error('Error during signin:', err);
    res.status(500).json({error:true, message: 'Internal Server Error', error: err.message });
  }
};


exports.update = async (req, res) => {
  const { user_id, username, phone, address, pincode, country, state, modified_by } = req.body;

  // Ensure that at least one field (username, phone, address, pincode, country, state) is provided
  if (!username && !phone && !address && !pincode && !country && !state && !user_id) {
    return res.status(400).json({ error:true,message: 'User ID, new username, address, pincode, country, or state is required' });
  }

  // Verify the JWT token to authenticate the user
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error:true,message: 'Authorization token is required' });
  }

  try {
    // Verify token and get decoded data
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If a specific `user_id` is provided, ensure the user exists in the database
    const [userResult] = await db.query('SELECT * FROM users WHERE user_id = ?', [user_id]);

    if (userResult.length === 0) {
      return res.status(404).json({ error:true,message: 'User not found' });
    }

    const user = userResult[0];
    let updateRequired = false;
    let updatedUsername = user.username;
    let updatedPhone = user.phone;
    let updatedAddress = user.address;
    let updatedPincode = user.pincode;
    let updatedCountry = user.country;
    let updatedState = user.state;

    // Check if the fields need to be updated
    if (username && username !== user.username) {
      updatedUsername = username;
      updateRequired = true;
    }

    if (phone && phone !== user.phone) {
      updatedPhone = phone;
      updateRequired = true;
    }

    if (address && address !== user.address) {
      updatedAddress = address;
      updateRequired = true;
    }

    if (pincode && pincode !== user.pincode) {
      updatedPincode = pincode;
      updateRequired = true;
    }

    if (country && country !== user.country) {
      updatedCountry = country;
      updateRequired = true;
    }

    if (state && state !== user.state) {
      updatedState = state;
      updateRequired = true;
    }

    // If no update is required, skip the database update
    if (!updateRequired) {
      return res.status(400).json({ error:true,message: 'No update happened' });
    }

    // Update the fields including the new pincode, country, and state
    const updateQuery = `
      UPDATE users
      SET username = ?, phone = ?, address = ?, pincode = ?, country = ?, state = ?, modified_date = CURRENT_TIMESTAMP, modified_by = ?
      WHERE user_id = ?
    `;

    const [updateResult] = await db.query(updateQuery, [
      updatedUsername, updatedPhone, updatedAddress, updatedPincode, updatedCountry, updatedState, modified_by, user_id
    ]);

    // Check if any rows were affected
    if (updateResult.affectedRows === 0) {
      return res.status(400).json({ error:true,message: 'No update happened, database values remain the same' });
    }

    return res.status(200).json({
      error:false,
      message: 'User settings updated successfully',
      username: updatedUsername,
      email_id: user.email_id,
      phone: updatedPhone,
      address: updatedAddress,
      pincode: updatedPincode,
      country: updatedCountry,
      state: updatedState,
      modified_by: modified_by,
    });

  } catch (err) {
    console.error('Error during update:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ error:true,message: 'Invalid token' });
    }
    return res.status(500).json({ error:true,message: 'Internal Server Error', error: err.message });
  }
};


exports.getUserOrderAndDetails = async (req, res) => {
  const { user_id } = req.params; // Get the user ID from the request parameters

  // Query to fetch user details, order summary, and total cart items
  const query = `
    SELECT 
      u.username, 
      u.phone, 
      u.email_id, 
      u.address, 
      u.pincode, 
      u.country, 
      u.state,
      COUNT(DISTINCT CASE 
        WHEN o.status IN ('Confirmed', 'Shipped', 'Out for Delivery', 'Dispatched', 'Delivered') THEN o.order_id
        ELSE NULL 
      END) AS total_orders,  -- Count only valid orders
      COUNT(DISTINCT CASE 
        WHEN p.payment_status = 'Incomplete' THEN o.order_id  -- Count orders with 'Incomplete' payment status (regardless of order status)
        ELSE NULL 
      END) AS pending_orders,  -- Count all orders with 'Incomplete' payment status
      COUNT(DISTINCT c.cart_id) AS total_cart_items  -- Counting distinct cart items for the user
    FROM users u
    LEFT JOIN orders o ON u.user_id = o.user_id
    LEFT JOIN payments p ON o.order_id = p.order_id  -- Join with payments to check payment status
    LEFT JOIN cart c ON u.user_id = c.user_id
    WHERE u.user_id = ?
    GROUP BY u.user_id
  `;

  try {
    const [result] = await db.query(query, [user_id]);

    if (result.length === 0) {
      return res.status(404).json({ error:true,message: 'User not found or no data available' });
    }

    // Respond with the user details, order summary, and cart details
    res.status(200).json({
      error:false,
      message: 'User details, order summary, and cart items fetched successfully',
      user_summary: result[0], // Contains user details, total_orders, incomplete_orders, and total_cart_items
    });
  } catch (err) {
    console.error("Failed to fetch user details, orders, and cart items:", err);
    return res.status(500).json({ error:true,message:'failed to fetch user details' });
  }
};
// Assuming EmailConfig is imported

exports.forgotPassword = async (req, res) => {
  const { email_id } = req.body;
  
  if (!email_id) {
    return res.status(400).json({error:true, message: 'Email is required' });
  }

  try {
    // Check if the user exists
    const [userResult] = await db.query('SELECT * FROM users WHERE email_id = ?', [email_id]);

    if (userResult.length === 0) {
      return res.status(404).json({ error:true, message: 'User not found' });
    }

    const user = userResult[0];

    // Check if the user is an admin (role_id = 1), and restrict if so
    if (user.role_id !== 1) {
      return res.status(400).json({ error:true, message: 'Wrong Email Address' });
    }

    // Generate OTP and send to the user
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiryTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    await db.query('UPDATE users SET otp = ?, otp_expiry = ? WHERE email_id = ?', [otp, expiryTime, email_id]);

    const emailResponse = await EmailConfig(email_id, otp);

    if (emailResponse) {
      return res.status(200).json({error:false, message: 'OTP sent to email successfully' });
    } else {
      return res.status(500).json({ error:true,message: 'Failed to send OTP' });
    }

  } catch (err) {
    console.error("Error during forgot password process:", err);
    return res.status(500).json({ error:true,message: 'Internal Server Error', error: err.message });
  }
};


exports.verifyOTP = async (req, res) => {
  const { otp } = req.body;  // Only OTP is required

  if (!otp) {
    return res.status(400).json({ error:true,message: 'OTP is required' });
  }

  try {
    const [result] = await db.query('SELECT * FROM users WHERE otp = ?', [otp]);

    if (result.length === 0) {
      return res.status(404).json({ error:true,message: 'Invalid OTP' });
    }

    const user = result[0];

    // Check if the user is an admin (role_id = 1)
    if (user.role_id !== 1) {
      return res.status(403).json({ error:true, message: 'Wrong Email Address' });
    }

    // Check if OTP is expired
    const currentTime = new Date();
    const otpExpiryTime = new Date(user.otp_expiry);

    if (currentTime > otpExpiryTime) {
      return res.status(400).json({ error:true,message: 'OTP has expired' });
    }

    return res.status(200).json({ error:false,message: 'OTP verified successfully. You can now reset your password.' });
  } catch (err) {
    return res.status(500).json({ error:true,message: 'Database error', error: err });
  }
};

exports.resetPassword = async (req, res) => {
  const { email_id, new_password } = req.body;

  // Check if email and new password are provided
  if (!email_id || !new_password) {
    return res.status(400).json({ error:true,message: 'Email and new password are required' });
  }

  try {
    // Check if the user exists
    const [result] = await db.query('SELECT * FROM users WHERE email_id = ?', [email_id]);

    if (result.length === 0) {
      return res.status(404).json({ error:true,message: 'User not found' });
    }

    // Update the user's password in the database (without hashing for simplicity)
    await db.query('UPDATE users SET password = ?, otp = NULL, otp_expiry = NULL WHERE email_id = ?', [new_password, email_id]);

    return res.status(200).json({ error:false,message: 'Password reset successfully' });
  } catch (err) {
    return res.status(500).json({ error:true,message: 'Error resetting password', error: err });
  }
};
