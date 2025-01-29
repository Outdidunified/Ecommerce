//const db=require('D:\\BackendEcommerce\\BACKEND\\BACKEND\\config\\db.js')
const db=require('../../../config/db');
const jwt = require('jsonwebtoken');
//const bcrypt = require('bcrypt'); 
exports.signup = async (req, res) => {
  const { username, email_id, password, user_type } = req.body;
  console.log(req.body);

  if (!username || !email_id || !password || !user_type) {
    return res.status(400).json({ message: 'Username, email, password, and user type are required' });
  }

  try {
    // Handle both admin and user signup based on user_type
    const [roleResult] = await db.query('SELECT role_id FROM roles WHERE role_name = ?', [user_type]);

    if (roleResult.length === 0) {
      return res.status(400).json({ message: `Role "${user_type}" does not exist in the roles table` });
    }

    const role_id = roleResult[0].role_id;

    // Check if the user already exists
    const [userResult] = await db.query('SELECT * FROM users WHERE email_id = ?', [email_id]);

    if (userResult.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Insert the new user into the users table
    const [insertResult] = await db.query('INSERT INTO users (username, email_id, password, role_id, user_type) VALUES (?, ?, ?, ?, ?)', 
      [username, email_id, password, role_id, user_type]);

    const user_id = insertResult.insertId;
    res.status(200).json({
      message: `${user_type.charAt(0).toUpperCase() + user_type.slice(1)} registered successfully`,
      user_id,
      username,
      email_id,
      user_type,
    });
  } catch (err) {
    console.error('Error in signup:', err);
    return res.status(500).json({ message: 'Error processing request', error: err.message });
  }
};

exports.signin = async (req, res) => {
  const { email_id, password } = req.body;
  console.log(req.body);

  if (!email_id || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Check if the user exists in the 'users' table
    const [userResult] = await db.query('SELECT * FROM users WHERE email_id = ?', [email_id]);

    if (userResult.length === 0) return res.status(404).json({ message: 'User not found' });

    const user = userResult[0];

    // Check if the user's account is active (active = 1)
    if (user.active === 0) {
      return res.status(403).json({ message: 'Your account is deactivated' });
    }

    // Check if password is correct
    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Fetch role name for the user from roles table based on role_id
    const [roleResult] = await db.query('SELECT role_name FROM roles WHERE role_id = ?', [user.role_id]);

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
      role_name: role_name,
      role_id: user.role_id,
      user_type: user.user_type,
    });
  } catch (err) {
    console.error('Error in signin:', err);
    return res.status(500).json({ message: 'Error processing request', error: err.message });
  }
};



exports.updateSettings = async (req, res) => {
  const { user_id, username, password, modified_by } = req.body;

  // Ensure that at least one field (username or password) is provided
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

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // If a specific `user_id` is provided, ensure the user exists in the database
    const [result] = await db.query('SELECT * FROM users WHERE user_id = ?', [user_id]);

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
      return res.status(400).json({ message: 'No update happened' });
    }

    // Update the username, password, and modified_by
    const updateQuery = `
      UPDATE users
      SET username = ?, password = ?, modified_date = CURRENT_TIMESTAMP, modified_by = ?
      WHERE user_id = ?
    `;
    const [updateResult] = await db.query(updateQuery, [updatedUsername, updatedPassword, modified_by, user_id]);

    // Check if any rows were affected
    if (updateResult.affectedRows === 0) {
      return res.status(400).json({ message: 'No update happened' });
    }

    return res.status(200).json({
      message: 'User settings updated successfully',
      username: updatedUsername,
      email_id: user.email_id,
      modified_by: modified_by
    });
  } catch (err) {
    console.error('Error updating user settings:', err);
    return res.status(500).json({ message: 'Error processing request', error: err.message });
  }
};


exports.getUserDetails = async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  console.log('Incoming Token:', token);

  if (!token) {
    console.error('Authorization token is missing');
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  try {
    // Verify the JWT token asynchronously
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // Retrieve and log the user_id from the request body
    const { user_id } = req.body;
    console.log('Incoming User ID:', user_id);

    if (!user_id) {
      console.error('User ID is missing in the request body');
      return res.status(400).json({ message: 'User ID is required in the request body' });
    }

    // Fetch the user details from the database
    const [userResult] = await db.query('SELECT * FROM users WHERE user_id = ?', [user_id]);

    if (userResult.length === 0) {
      console.warn('User not found for ID:', user_id);
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userResult[0];
    console.log('User Details:', user);

    // Fetch the role name for the user based on role_id
    const [roleResult] = await db.query('SELECT role_name FROM roles WHERE role_id = ?', [user.role_id]);

    if (roleResult.length === 0) {
      console.warn('Role not found for role_id:', user.role_id);
      return res.status(400).json({ message: 'Role not found for the user' });
    }

    // Add role_name to the user object
    user.role_name = roleResult[0].role_name;
    console.log('Final User Details with Role:', user);

    // Send the user details as response
    return res.status(200).json({
      message: 'User retrieved successfully',
      user: user,
    });

  } catch (err) {
    console.error('Error verifying token or fetching user details:', err.message);
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'Invalid token' });
    } else {
      return res.status(500).json({ message: 'Error processing request', error: err.message });
    }
  }
};



exports.addUser = async (req, res) => {
  const { username, email_id, password, user_type, address, pincode, phone, role_id, country, state, created_by } = req.body;

  // Admin should have role_id 2
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  try {
    // Verify the JWT token asynchronously
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user has admin rights (role_id 2)
    if (decoded.role !== 2) {
      return res.status(403).json({ message: 'Admin rights are required to add a user' });
    }

    // Check if the provided role_id is valid (either admin or user role)
    if (![1, 2].includes(role_id)) {
      return res.status(400).json({ message: 'Invalid role_id. Only role_id 1 (user) or 2 (admin) are allowed' });
    }

    // Check if the admin's role_id = 2 and status = 0, if yes, they cannot add new users
    const [roleResult] = await db.query('SELECT status FROM roles WHERE role_id = ?', [decoded.role]);

    if (roleResult.length > 0 && roleResult[0].status === 0) {
      return res.status(403).json({ message: 'This admin account is deactivated' });
    }

    // Check if the user already exists
    const [userResult] = await db.query('SELECT * FROM users WHERE email_id = ?', [email_id]);

    if (userResult.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Insert the new user into the database
    const query = `INSERT INTO users (username, email_id, password, user_type, address, role_id, pincode, phone, country, state, created_by) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const [insertResult] = await db.query(query, [username, email_id, password, user_type, address, role_id, pincode, phone, country, state, created_by]);

    return res.status(200).json({ message: 'User added successfully', user_id: insertResult.insertId });

  } catch (err) {
    console.error('Error in adding user:', err.message);
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'Invalid token' });
    } else {
      return res.status(500).json({ message: 'Error processing request', error: err.message });
    }
  }
};


// Update user (Admin only)
exports.updateUser = async (req, res) => {
  const { user_id, username, email_id, password, role_id, user_type, address, pincode, phone, country, state, modified_by } = req.body;

  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  try {
    // Verify the JWT token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user has admin rights (role_id 2)
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

    // Fetch current user data
    const [currentUserResult] = await db.query('SELECT * FROM users WHERE user_id = ?', [user_id]);

    if (!currentUserResult.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentUser = currentUserResult[0];

    // Compare the current user data with the provided data
    let changesMade = false;
    for (const key in fieldsToUpdate) {
      if (fieldsToUpdate[key] !== currentUser[key]) {
        changesMade = true;
        break;
      }
    }

    if (!changesMade) {
      return res.status(400).json({ message: 'No changes happened' });
    }

    // Update query for the user
    const query = `UPDATE users SET username = ?, email_id = ?, password = ?, role_id = ?, user_type = ?, address = ?, pincode = ?, phone = ?, country = ?, state = ?, modified_by = ? 
                   WHERE user_id = ?`;

    // Execute the update query
    await db.query(query, [username, email_id, password, role_id, user_type, address, pincode, phone, country, state, modified_by, user_id]);

    res.status(200).json({ message: 'User updated successfully' });

  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'Invalid token' });
    }
    console.error('Error updating user:', err.message);
    return res.status(500).json({ message: 'Error updating user', error: err.message });
  }
};


exports.deactivateUser = async (req, res) => {
  const { user_id, active, modified_by } = req.body;

  // Validation for required fields
  if (!user_id || active === undefined || !modified_by) {
    return res.status(400).json({ message: 'user_id, active, and modified_by are required.' });
  }

  // Check if active is either 0 (inactive) or 1 (active)
  if (![0, 1].includes(active)) {
    return res.status(400).json({ message: 'active should be 0 (inactive) or 1 (active).' });
  }

  const updateQuery = `
    UPDATE users 
    SET active = ?, modified_by = ?, modified_date = CURRENT_TIMESTAMP 
    WHERE user_id = ?
  `;

  try {
    // Execute the update query asynchronously
    const [result] = await db.query(updateQuery, [active, modified_by, user_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User ID not found.' });
    }

    const statusMessage = active === 1 ? 'User activated successfully.' : 'User deactivated successfully.';
    return res.status(200).json({ message: statusMessage });

  } catch (err) {
    console.error('Error deactivating user:', err.message);
    return res.status(500).json({ error: err.message });
  }
};


// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  try {
    // Verify the JWT token asynchronously
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user has admin rights (role_id 2)
    if (decoded.role !== 2) {
      return res.status(403).json({ message: 'Admin rights are required to fetch all users' });
    }

    // Query to get all users (no filter on active status)
    const [result] = await db.query('SELECT * FROM users');

    return res.status(200).json({
      message: 'All users retrieved successfully',
      users: result
    });

  } catch (err) {
    console.error('Error retrieving users:', err.message);
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'Invalid token' });
    } else {
      return res.status(500).json({ message: 'Error processing request', error: err.message });
    }
  }
};


