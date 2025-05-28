const { verifyToken } = require('../utils/auth');

/**
 * Express middleware to authenticate JWT tokens.
 * Extracts the token from the Authorization header, verifies it,
 * and attaches the decoded user payload to req.user if valid.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Expecting "Bearer TOKEN_STRING"

    if (token) {
      try {
        const decoded = verifyToken(token);
        req.user = decoded; // Attach decoded user payload (e.g., { id, username }) to the request object
      } catch (error) {
        // Token is invalid (e.g., expired, malformed, signature mismatch)
        // For now, we'll proceed without a req.user.
        // Specific routes can then check for req.user and deny access if it's missing.
        // Alternatively, you could send a 401/403 response here:
        // return res.status(401).json({ message: 'Invalid or expired token.' });
        console.warn('JWT authentication failed:', error.message);
      }
    }
  }
  next(); // Proceed to the next middleware or route handler
}

module.exports = {
  authenticateJWT,
};
