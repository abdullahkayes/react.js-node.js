const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next({ statusCode: 401, message: 'Not authenticated' });
    }
    if (!roles.includes(req.user.role)) {
      return next({ statusCode: 403, message: 'Access denied: insufficient role' });
    }
    next();
  };
};

export default requireRole;
