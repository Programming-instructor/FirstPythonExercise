const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

exports.permissionMiddleware = (requiredPermissions) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.isAdmin) {
        req.user = user;
        return next();
      }

      const hasPermission = requiredPermissions.some(permission =>
        user.permissions.includes(permission)
      );
      if (!hasPermission) {
        console.log('Insufficient permissions:', requiredPermissions); // Debug: Log missing permissions
        return res.status(403).json({ message: 'Insufficient permissions' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Permission middleware error:', error); // Debug: Log detailed error
      res.status(500).json({ message: 'Server error during permission check' });
    }
  };
};