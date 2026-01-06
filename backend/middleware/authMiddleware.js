const jwt = require('jsonwebtoken');

module.exports = (roles) => {
  return (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      console.log('No token provided'); // Debug log
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
      console.log('Token received:', token); // Debug log
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded); // Debug log

      // Check user role
      if (!roles.includes(decoded.role)) {
        console.log('Insufficient role:', decoded.role); // Debug log
        return res.status(403).json({ message: 'Access denied: Insufficient role' });
      }

      req.user = decoded;
      next();
    } catch (err) {
      console.error('Token validation error:', err.message); // Log the error
      res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  };
};
