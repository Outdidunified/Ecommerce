
const db=require('../../../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {EmailConfig}=require('../auth/Email');
const crypto = require('crypto');
exports.signup = (req, res) => {
  const { username, email_id, password, user_type } = req.body;
  console.log(req.body);

  if (!username || !email_id || !password || !user_type) {
    return res.status(400).json({ message: 'Username, email, password, and user type are required' });
  }

  // Handle both admin and user signup based on user_type
  db.query('SELECT role_id FROM roles WHERE role_name = ?', [user_type], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });

    if (result.length === 0) {
      return res.status(400).json({ message: `Role "${user_type}" does not exist in the roles table` });
    }

    const role_id = result[0].role_id;

    // Check if the user already exists
    db.query('SELECT * FROM users WHERE email_id = ?', [email_id], (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });

      if (result.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Insert the new user into the users table
      const query = 'INSERT INTO users (username, email_id, password, role_id, user_type) VALUES (?, ?, ?, ?, ?)';
      db.query(query, [username, email_id, password, role_id, user_type], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error creating user', error: err });

        const user_id = result.insertId;
        res.status(200).json({
          message: `${user_type.charAt(0).toUpperCase() + user_type.slice(1)} registered successfully`,
          user_id,
          username,
          email_id,
          user_type,
        });
      });
    });
  });
};

exports.signin = (req, res) => {
  const { email_id, password } = req.body;
  console.log(req.body);

  if (!email_id || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Check if the user exists in the 'users' table
  db.query('SELECT * FROM users WHERE email_id = ?', [email_id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });

    if (result.length === 0) return res.status(404).json({ message: 'User not found' });

    const user = result[0];

    // Check if password is correct
    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Fetch role name for the user from roles table based on role_id
    db.query('SELECT role_name FROM roles WHERE role_id = ?', [user.role_id], (err, roleResult) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });

      if (roleResult.length === 0) {
        return res.status(400).json({ message: 'Role not found for user' });
      }

      const role_name = roleResult[0].role_name;

      // Create JWT token
      const token = jwt.sign(
        { user_id: user.user_id, role: user.role_id },
        process.env.JWT_SECRET
      );

      console.log('JWT Token:', token); // Log the token

      res.status(200).json({
        message: 'Sign in successful',
        token,
        user_id: user.user_id,
        username: user.username,
        password: user.password,
        email_id: user.email_id,
        //role: role_name,
        role_id: user.role_id,
        user_type: user.user_type,
      });
    });
  });
};

exports.update = (req, res) => {
  const { user_id, username, password, address, pincode, country, state, modified_by } = req.body;

  // Ensure that at least one field (username, password, address, pincode, country, state) is provided
  if (!username && !password && !address && !pincode && !country && !state && !user_id) {
    return res.status(400).json({ message: 'User ID, new username, password, address, pincode, country, or state is required' });
  }

  // Verify the JWT token to authenticate the user
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    // If a specific `user_id` is provided, ensure the user exists in the database
    db.query('SELECT * FROM users WHERE user_id = ?', [user_id], (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });

      if (result.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = result[0];
      let updateRequired = false;
      let updatedUsername = user.username;
      let updatedPassword = user.password;
      let updatedAddress = user.address;
      let updatedPincode = user.pincode;
      let updatedCountry = user.country;
      let updatedState = user.state;

      // Check if the username is different from the current username
      if (username && username !== user.username) {
        updatedUsername = username;
        updateRequired = true;
      }

      // If a new password is being updated
      if (password && password !== user.password) {
        updatedPassword = password;
        updateRequired = true;
      }

      // If a new address is being updated
      if (address && address !== user.address) {
        updatedAddress = address;
        updateRequired = true;
      }

      // If a new pincode is being updated
      if (pincode && pincode !== user.pincode) {
        updatedPincode = pincode;
        updateRequired = true;
      }

      // If a new country is being updated
      if (country && country !== user.country) {
        updatedCountry = country;
        updateRequired = true;
      }

      // If a new state is being updated
      if (state && state !== user.state) {
        updatedState = state;
        updateRequired = true;
      }

      // If no update is required, skip the database update
      if (!updateRequired) {
        return res.status(400).json({ message: 'No update happened, data is already up to date' });
      }

      // Update the fields including the new pincode, country, and state
      const updateQuery = `
        UPDATE users
        SET username = ?, password = ?, address = ?, pincode = ?, country = ?, state = ?, modified_date = CURRENT_TIMESTAMP, modified_by = ?
        WHERE user_id = ?
      `;

      // Pass the modified_by from req.body (instead of decoded user_id) 
      db.query(updateQuery, [updatedUsername, updatedPassword, updatedAddress, updatedPincode, updatedCountry, updatedState, modified_by, user_id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error updating user', error: err });

        // Check if any rows were affected
        if (result.affectedRows === 0) {
          return res.status(400).json({ message: 'No update happened, database values remain the same' });
        }

        return res.status(200).json({
          message: 'User settings updated successfully',
          username: updatedUsername,
          email_id: user.email_id,
          address: updatedAddress,  // Include updated address in response
          pincode: updatedPincode,  // Include updated pincode in response
          country: updatedCountry,  // Include updated country in response
          state: updatedState,      // Include updated state in response
          modified_by: modified_by,  // Return the user who made the modification
        });
      });
    });
  });
};



exports.getUserOrderAndDetails = (req, res) => {
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
      COUNT(DISTINCT CASE WHEN o.status NOT IN ('Cancelled', 'Pending') AND o.status IS NOT NULL THEN o.order_id END) AS total_orders, 
      COUNT(CASE WHEN o.status = 'Pending' THEN 1 ELSE NULL END) AS pending_orders,
      COUNT(DISTINCT c.cart_id) AS total_cart_items  -- Counting distinct cart items for the user
    FROM users u
    LEFT JOIN orders o ON u.user_id = o.user_id
    LEFT JOIN cart c ON u.user_id = c.user_id
    WHERE u.user_id = ?
    GROUP BY u.user_id
  `;

  db.query(query, [user_id], (err, result) => {
    if (err) {
      console.error("Failed to fetch user details, orders, and cart items:", err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found or no data available' });
    }

    // Respond with the user details, order summary, and cart details
    res.status(200).json({
      message: 'User details, order summary, and cart items fetched successfully',
      user_summary: result[0], // Contains user details, total_orders, pending_orders, and total_cart_items
    });
  });
};




exports.forgotPassword = (req, res) => {
  const { email_id } = req.body;
  
  if (!email_id) {
    return res.status(400).json({ message: 'Email is required' });
  }

  // Check if the user exists
  db.query('SELECT * FROM users WHERE email_id = ?', [email_id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });

    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a random OTP (6 digits)
    const otp = crypto.randomInt(100000, 999999).toString();

    // Store OTP in the database temporarily with an expiry time (e.g., 10 minutes)
    const expiryTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    db.query('UPDATE users SET otp = ?, otp_expiry = ? WHERE email_id = ?', [otp, expiryTime, email_id], (err, result) => {
      if (err) return res.status(500).json({ message: 'Error updating OTP', error: err });

      // Send OTP to user via email
      EmailConfig(email_id, otp).then(response => {
        if (response) {
          res.status(200).json({ message: 'OTP sent to email successfully' });
        } else {
          res.status(500).json({ message: 'Failed to send OTP' });
        }
      });
    });
  });
};


exports.verifyOTP = (req, res) => {
  const { otp } = req.body;  // Only OTP is required

  // Check if OTP is provided
  if (!otp) {
    return res.status(400).json({ message: 'OTP is required' });
  }

  // Check if the OTP exists in the database
  db.query('SELECT * FROM users WHERE otp = ?', [otp], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });

    if (result.length === 0) {
      return res.status(404).json({ message: 'Invalid OTP' });
    }

    const user = result[0];

    // Check if OTP is expired
    const currentTime = new Date();
    const otpExpiryTime = new Date(user.otp_expiry);

    if (currentTime > otpExpiryTime) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // OTP is valid
    res.status(200).json({ message: 'OTP verified successfully. You can now reset your password.' });
  });
};

exports.resetPassword = (req, res) => {
  const { email_id, new_password } = req.body;
console.log(req.body);
  if (!email_id || !new_password) {
    return res.status(400).json({ message: 'Email and new password are required' });
  }


  // Check if the user exists
  db.query('SELECT * FROM users WHERE email_id = ?', [email_id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });

    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result[0];

    // Update the user's password in the database (without hashing for simplicity)
    db.query('UPDATE users SET password = ?, otp = NULL, otp_expiry = NULL WHERE email_id = ?', [new_password, email_id], (err, result) => {
      if (err) return res.status(500).json({ message: 'Error resetting password', error: err });

      res.status(200).json({ message: 'Password reset successfully' });
    });
  });
};
