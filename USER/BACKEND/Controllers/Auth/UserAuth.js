const db = require('../../config/db');
const jwt = require('jsonwebtoken');
exports.signup = (req, res) => {
    const { username, email_id, password, user_type } = req.body;
  
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