const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];  // Extract the token from the Authorization header

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token using the JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;  // Attach decoded user data to the request object
    next();  // Proceed to the next middleware/route handler
  } catch (err) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = authenticate;
