const db = require('../../../config/db');

exports.addRole = async (req, res) => {
  const { role_name, created_by } = req.body;

  // Validation for required fields
  if (!role_name || !created_by) {
    return res.status(400).json({
      message: 'role_name and created_by are required.',
    });
  }

  try {
    // Check if the role_name already exists in the roles table
    const [existingRoles] = await db.query('SELECT * FROM roles WHERE role_name = ?', [role_name]);

    if (existingRoles.length > 0) {
      return res.status(400).json({
        message: 'Role name already exists.',
      });
    }

    // Insert the new role if role_name doesn't exist
    const [result] = await db.query('INSERT INTO roles (role_name, created_by) VALUES (?, ?)', [role_name, created_by]);

    res.status(201).json({
      message: 'Role added successfully',
      role_id: result.insertId, // Return the auto-incremented role_id
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: err.message });
  }
};


// Function to get all roles
exports.getAllRoles = async (req, res) => {
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
  
  try {
    const [results] = await db.query(query);
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching roles:', err);
    res.status(500).json({ error: err.message });
  }
};

// Function to update role_name
exports.updateRoleName = async (req, res) => {
  const { role_id, role_name, modified_by } = req.body;

  // Validation for required fields
  if (!role_id || !role_name || !modified_by) {
    return res.status(400).json({
      message: 'role_id, role_name, and modified_by are required for updating.',
    });
  }

  try {
    // Check the current role name to compare with the new one
    const [currentRole] = await db.query('SELECT role_name FROM roles WHERE role_id = ?', [role_id]);

    if (currentRole.length === 0) {
      return res.status(404).json({ message: 'Role ID not found.' });
    }

    const currentRoleName = currentRole[0].role_name;

    // If the new role name is the same as the current one, send a message saying no update happened
    if (currentRoleName === role_name) {
      return res.status(400).json({ message: 'No changes happened' });
    }

    // Update the role_name, modified_by, and modified_date for the given role_id
    const [updateResult] = await db.query(`
      UPDATE roles 
      SET role_name = ?, modified_by = ?, modified_date = CURRENT_TIMESTAMP
      WHERE role_id = ?`, [role_name, modified_by, role_id]);

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: 'Role ID not found.' });
    }

    res.status(200).json({ message: 'Role name updated successfully.' });
  } catch (err) {
    console.error('Error updating role name:', err);
    res.status(500).json({ error: err.message });
  }
};

// Function to deactivate a role
exports.deactivaterole = async (req, res) => {
  const { role_id, status, modified_by } = req.body;

  // Validation for required fields
  if (!role_id || status === undefined || !modified_by) {
    return res.status(400).json({ message: 'role_id, status, and modified_by are required.' });
  }

  // Check if status is either 0 (inactive) or 1 (active)
  if (![0, 1].includes(status)) {
    return res.status(400).json({ message: 'status should be 0 (inactive) or 1 (active).' });
  }

  try {
    // Update the status to active (1) or inactive (0) for the given role_id
    const [updateResult] = await db.query(`
      UPDATE roles 
      SET status = ?, modified_by = ?, modified_date = CURRENT_TIMESTAMP 
      WHERE role_id = ?`, [status, modified_by, role_id]);

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: 'Role ID not found.' });
    }

    const statusMessage = status === 1 ? 'Role activated successfully.' : 'Role deactivated successfully.';
    res.status(200).json({ message: statusMessage });
  } catch (err) {
    console.error('Error deactivating role:', err);
    res.status(500).json({ error: err.message });
  }
};
