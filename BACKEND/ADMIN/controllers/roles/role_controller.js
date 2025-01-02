const db = require('../../config/db');

// Function to add a role
exports.addRole = (req, res) => {
    const { role_name, created_by } = req.body;
  
    // Validation for required fields
    if (!role_name || !created_by) {
      return res.status(400).json({
        message: 'role_name and created_by are required.',
      });
    }
  
    // Check if the role_name already exists in the roles table
    const checkRoleQuery = `SELECT * FROM roles WHERE role_name = ?`;
  
    db.query(checkRoleQuery, [role_name], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      // If role_name already exists, return an error message
      if (result.length > 0) {
        return res.status(400).json({
          message: 'Role name already exists.',
        });
      }
  
      // If role_name doesn't exist, insert the new role
      const insertRoleQuery = `
        INSERT INTO roles 
        (role_name, created_by)
        VALUES (?, ?)
      `;
  
      db.query(insertRoleQuery, [role_name, created_by], (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
  
        res.status(201).json({
          message: 'Role added successfully',
          role_id: result.insertId, // Return the auto-incremented role_id
        });
      });
    });
  };
  
  

// Function to get all roles
exports.getAllRoles = (req, res) => {
  const query = `
    SELECT 
      r.role_id, 
      r.role_name, 
      r.created_by, 
      r.created_date,
      r.modified_date,
      r.modified_by, 
      r.status
    FROM roles r
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(200).json(results);
  });
};


// Function to update role_name
exports.updateRoleName = (req, res) => {
    const { role_id, role_name, modified_by } = req.body;
  
    // Validation for required fields
    if (!role_id || !role_name || !modified_by) {
      return res.status(400).json({
        message: 'role_id, role_name, and modified_by are required for updating.',
      });
    }
  
    // Check the current role name to compare with the new one
    const checkCurrentRoleQuery = `
      SELECT role_name 
      FROM roles 
      WHERE role_id = ?
    `;
  
    db.query(checkCurrentRoleQuery, [role_id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      if (result.length === 0) {
        return res.status(404).json({ message: 'Role ID not found.' });
      }
  
      const currentRoleName = result[0].role_name;
  
      // If the new role name is the same as the current one, send a message saying no update happened
      if (currentRoleName === role_name) {
        return res.status(400).json({ message: 'No updates were made. The role name is the same.' });
      }
  
      // Update the role_name, modified_by, and modified_date for the given role_id
      const updateRoleQuery = `
        UPDATE roles 
        SET role_name = ?, modified_by = ?, modified_date = CURRENT_TIMESTAMP
        WHERE role_id = ?
      `;
  
      db.query(updateRoleQuery, [role_name, modified_by, role_id], (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
  
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Role ID not found.' });
        }
  
        res.status(200).json({ message: 'Role name updated successfully.' });
      });
    });
  };
  
  
  

// Function to deactivate a role
exports.deactivateProduct = (req, res) => {
    const { role_id, status, modified_by } = req.body;
  
    // Validation for required fields
    if (!role_id || status === undefined || !modified_by) {
      return res.status(400).json({ message: 'role_id, status, and modified_by are required.' });
    }
  
    // Check if status is either 0 (inactive) or 1 (active)
    if (![0, 1].includes(status)) {
      return res.status(400).json({ message: 'status should be 0 (inactive) or 1 (active).' });
    }
  
    // Update the status to active (1) or inactive (0) for the given role_id
    const updateQuery = `
      UPDATE roles 
      SET status = ?, modified_by = ?, modified_date = CURRENT_TIMESTAMP 
      WHERE role_id = ?
    `;
  
    db.query(updateQuery, [status, modified_by, role_id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Role ID not found.' });
      }
  
      const statusMessage = status === 1 ? 'Role activated successfully.' : 'Role deactivated successfully.';
      res.status(200).json({ message: statusMessage });
    });
  };
  
  