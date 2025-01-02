const db = require('../../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 
// Signup function
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
        role: role_name,
        role_id: user.role_id,
        user_type: user.user_type,
      });
    });
  });
};

exports.updateSettings = (req, res) => {
  const { user_id, username, password, modified_by } = req.body;

  // Ensure that at least one field (username or new_password) is provided
  if (!username && !password && !user_id) {
    return res.status(400).json({ message: 'User ID, new username, or password is required' });
  }

  // Ensure the modified_by field is provided if a change is made
  if (!modified_by) {
    return res.status(400).json({ message: 'Modified by field is required' });
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

      // If no update is required, skip the database update
      if (!updateRequired) {
        return res.status(400).json({ message: 'No update happened, data is already up to date' });
      }

      // Update the username, password, and modified_by
      const updateQuery = `
        UPDATE users
        SET username = ?, password = ?, modified_date = CURRENT_TIMESTAMP, modified_by = ?
        WHERE user_id = ?
      `;

      db.query(updateQuery, [updatedUsername, updatedPassword, modified_by, user_id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error updating user', error: err });

        // Check if any rows were affected
        if (result.affectedRows === 0) {
          return res.status(200).json({ message: 'No update happened, database values remain the same' });
        }

        return res.status(200).json({
          message: 'User settings updated successfully',
          username: updatedUsername,
          email_id: user.email_id,
          modified_by: modified_by
        });
      });
    });
  });
};


// Get all users function
exports.getUserDetails = (req, res) => {
  // Extract and log the JWT token from the authorization header
  const token = req.headers['authorization']?.split(' ')[1];
  console.log('Incoming Token:', token);

  if (!token) {
    console.error('Authorization token is missing');
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  // Verify the JWT token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Invalid token:', err.message);
      return res.status(403).json({ message: 'Invalid token' });
    }

    // Retrieve and log the user_id from the request body
    const user_id = req.body.user_id;
    console.log('Incoming User ID:', user_id);

    if (!user_id) {
      console.error('User ID is missing in the request body');
      return res.status(400).json({ message: 'User ID is required in the request body' });
    }

    // Fetch the user details from the database
    db.query('SELECT * FROM users WHERE user_id = ?', [user_id], (err, userResult) => {
      if (err) {
        console.error('Database error while fetching user details:', err);
        return res.status(500).json({ message: 'Database error', error: err });
      }

      if (userResult.length === 0) {
        console.warn('User not found for ID:', user_id);
        return res.status(404).json({ message: 'User not found' });
      }

      const user = userResult[0];
      console.log('User Details:', user);

      // Fetch the role name for the user based on role_id
      db.query('SELECT role_name FROM roles WHERE role_id = ?', [user.role_id], (err, roleResult) => {
        if (err) {
          console.error('Database error while fetching role name:', err);
          return res.status(500).json({ message: 'Database error', error: err });
        }

        if (roleResult.length === 0) {
          console.warn('Role not found for role_id:', user.role_id);
          return res.status(400).json({ message: 'Role not found for the user' });
        }

        // Add role_name to the user object
        user.role_name = roleResult[0].role_name;
        console.log('Final User Details with Role:', user);

        // Send the user details as response
        res.status(200).json({
          message: 'User retrieved successfully',
          user: user,
        });
      });
    });
  });
};




// Add new user (Admin only)
exports.addUser = (req, res) => {
  const { username, email_id, password, user_type, address, pincode, phone, role_id, country, state, created_by } = req.body;

  // Admin should have role_id 2
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    // Check if the user has admin rights (role_id 2)
    if (decoded.role !== 2) {
      return res.status(403).json({ message: 'Admin rights are required to add a user' });
    }

    // Check if the provided role_id is valid (either admin or user role)
    if (![1, 2].includes(role_id)) {
      return res.status(400).json({ message: 'Invalid role_id. Only role_id 1 (user) or 2 (admin) are allowed' });
    }

    // Check if the user already exists
    db.query('SELECT * FROM users WHERE email_id = ?', [email_id], (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });

      if (result.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Insert the new user into the database
      const query = `INSERT INTO users (username, email_id, password, user_type, address, role_id, pincode, phone, country, state, created_by) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      db.query(query, [username, email_id, password, user_type, address, role_id, pincode, phone, country, state, created_by], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error adding user', error: err });

        res.status(200).json({ message: 'User added successfully', user_id: result.insertId });
      });
    });
  });
};

// Update user (Admin only)
exports.updateUser = (req, res) => {
  const { user_id, username, email_id, password, role_id, user_type, address, pincode, phone, country, state, modified_by } = req.body;

  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    if (decoded.role !== 2) {
      return res.status(403).json({ message: 'Admin rights are required to update a user' });
    }

    // Check if any fields have actually changed
    const fieldsToUpdate = {
      username,
      email_id,
      password,
      role_id,
      user_type,
      address,
      pincode,
      phone,
      country,
      state,
      modified_by,
    };

    const currentUserQuery = `SELECT * FROM users WHERE user_id = ?`;
    db.query(currentUserQuery, [user_id], (err, result) => {
      if (err) return res.status(500).json({ message: 'Error fetching user data', error: err });

      const currentUser = result[0];

      // Compare the current user data with the provided data
      let changesMade = false;
      for (const key in fieldsToUpdate) {
        if (fieldsToUpdate[key] !== currentUser[key]) {
          changesMade = true;
          break;
        }
      }

      if (!changesMade) {
        return res.status(400).json({ message: 'No changes made to the user' });
      }

      // Update query for the user
      const query = `UPDATE users SET username = ?, email_id = ?, password = ?, role_id = ?, user_type = ?, address = ?, pincode = ?, phone = ?, country = ?, state = ?, modified_by = ? 
                     WHERE user_id = ?`;
      db.query(query, [username, email_id, password, role_id, user_type, address, pincode, phone, country, state, modified_by, user_id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error updating user', error: err });

        res.status(200).json({ message: 'User updated successfully' });
      });
    });
  });
};

// Delete user (Admin only)
exports.deactivateUser = (req, res) => {
  const { user_id, active, modified_by } = req.body;

  // Validation for required fields
  if (!user_id || active === undefined || !modified_by) {
    return res.status(400).json({ message: 'user_id, active, and modified_by are required.' });
  }

  // Check if active is either 0 (inactive) or 1 (active)
  if (![0, 1].includes(active)) {
    return res.status(400).json({ message: 'active should be 0 (inactive) or 1 (active).' });
  }

  // Update the active status for the user
  const updateQuery = `
    UPDATE users 
    SET active = ?, modified_by = ?, modified_date = CURRENT_TIMESTAMP 
    WHERE user_id = ?
  `;

  db.query(updateQuery, [active, modified_by, user_id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User ID not found.' });
    }

    const statusMessage = active === 1 ? 'User activated successfully.' : 'User deactivated successfully.';
    res.status(200).json({ message: statusMessage });
  });
};

// Get all users (Admin only)
exports.getAllUsers = (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    if (decoded.role !== 2) {
      return res.status(403).json({ message: 'Admin rights are required to fetch all users' });
    }

    db.query('SELECT * FROM users', (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });

      res.status(200).json({
        message: 'Users retrieved successfully',
        users: result
      });
    });
  });
};
