const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-jwt-secret-key-please-change';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-default-refresh-token-secret-key-please-change';
const ACCESS_TOKEN_EXPIRATION = '1h'; // e.g., 1 hour
const REFRESH_TOKEN_EXPIRATION = '7d'; // e.g., 7 days

/**
 * Hashes a plain password.
 * @param {string} password - The plain text password.
 * @returns {Promise<string>} - The hashed password.
 */
async function hashPassword(password) {
  const saltRounds = 10; // Cost factor for hashing
  return bcrypt.hash(password, saltRounds);
}

/**
 * Compares a plain password with a hashed password.
 * @param {string} plainPassword - The plain text password.
 * @param {string} hashedPassword - The hashed password from the database.
 * @returns {Promise<boolean>} - True if passwords match, false otherwise.
 */
async function comparePassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Generates a JWT access token.
 * @param {object} user - The user object to include in the token payload (e.g., { id, username }).
 * @returns {string} - The generated JWT access token.
 */
function generateAccessToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    // Add any other relevant non-sensitive user details
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });
}

/**
 * Generates a JWT refresh token.
 * @param {object} user - The user object to include in the token payload (e.g., { id }).
 * @returns {string} - The generated JWT refresh token.
 */
function generateRefreshToken(user) {
  const payload = {
    id: user.id,
    // Refresh tokens typically have minimal information, just enough to identify the user/session
  };
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });
}

/**
 * Verifies a JWT token.
 * @param {string} token - The JWT token string.
 * @param {boolean} isRefreshToken - Optional, set to true if verifying a refresh token.
 * @returns {object} - The decoded token payload if verification is successful.
 * @throws {Error} - If token is invalid, expired, or verification fails.
 */
function verifyToken(token, isRefreshToken = false) {
  const secret = isRefreshToken ? REFRESH_TOKEN_SECRET : JWT_SECRET;
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    // Handle specific JWT errors like TokenExpiredError, JsonWebTokenError
    console.error("Token verification failed:", error.name, error.message);
    throw new Error('Invalid or expired token.');
  }
}

module.exports = {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  ACCESS_TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION
};
