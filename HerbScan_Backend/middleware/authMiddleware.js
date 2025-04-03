// middleware/authMiddleware.js
const auth = (allowedRoles = ['user']) => {
  return (req, res, next) => {
    // Check if there is a session and a user saved in that session
    if (req.session && req.session.user) {
      // Check if the user's role is included in the allowed roles
      if (allowedRoles.includes(req.session.user.role)) {
        // Attach the user information to the request for downstream use
        req.user = req.session.user;
        next();
      } else {
        res.status(401).json({ error: 'Access denied: insufficient permissions.' });
      }
    } else {
      res.status(401).json({ error: 'Unauthorized access: no active session.' });
    }
  };
};

module.exports = auth;
