const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];  // Extract the token from the Authorization header

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Use a Promise to handle token verification asynchronously
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(400).json({ message: 'Invalid token.' });
    }

    // Attach decoded user data to the request object
    req.user = decoded;
    next();  // Proceed to the next middleware/route handler
  });
};

module.exports = authenticate;
