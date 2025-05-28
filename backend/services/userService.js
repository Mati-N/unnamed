const { User } = require('../db'); // Assuming db/index.js exports models
const { hashPassword, comparePassword, generateAccessToken, generateRefreshToken } = require('../utils/auth');

/**
 * Registers a new user.
 * @param {object} userData - User data including username, email, password, etc.
 * @returns {Promise<object>} - The created user object (excluding password).
 * @throws {Error} - If username or email already exists, or for other validation errors.
 */
async function registerUser(userData) {
  const { username, email, password, firstName, lastName, bio, profileImage, profileImageFile } = userData;

  // Validate input: Check for existing username or email
  const existingUserByUsername = await User.findOne({ where: { username } });
  if (existingUserByUsername) {
    throw new Error('Username already exists.');
  }
  const existingUserByEmail = await User.findOne({ where: { email } });
  if (existingUserByEmail) {
    throw new Error('Email already exists.');
  }

  if (!password) {
      throw new Error('Password is required.');
  }

  // Hash the password
  const hashedPassword = await hashPassword(password);

  // Create and save new user
  try {
    let actualProfileImage = profileImage; // Existing URL or null

    // Conceptual: If profileImageFile is provided, upload it and update actualProfileImage
    // if (profileImageFile) {
    //   const { createReadStream } = await profileImageFile;
    //   const stream = createReadStream();
    //   // const { uploadToCloudinary } = require('../utils/cloudinaryUploader'); // Would be imported
    //   // const cloudinaryResponse = await uploadToCloudinary(stream, { folder: 'user_profiles' });
    //   // actualProfileImage = cloudinaryResponse.secure_url;
    //   console.log('Conceptual: Uploaded profileImageFile, URL would be set to actualProfileImage');
    // }

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      bio,
      profileImage: actualProfileImage, // Use the potentially updated image URL
    });

    // Return user object (excluding password)
    const userResponse = newUser.toJSON();
    delete userResponse.password;
    return userResponse;
  } catch (error) {
    // Handle potential Sequelize validation errors (e.g., if model validations fail)
    console.error("Error creating user:", error);
    throw new Error('Could not create user. ' + error.message);
  }
}

/**
 * Logs in an existing user.
 * @param {object} loginData - User login data including username and password.
 * @returns {Promise<object>} - Object containing user details (excluding password), accessToken, and refreshToken.
 * @throws {Error} - If user not found or password does not match.
 */
async function loginUser({ username, password }) {
  // Find user by username
  const user = await User.findOne({ where: { username } });
  if (!user) {
    throw new Error('User not found.');
  }

  // Compare passwords
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid password.');
  }

  // Generate tokens
  const userPayload = { id: user.id, username: user.username };
  const accessToken = generateAccessToken(userPayload);
  const refreshToken = generateRefreshToken(userPayload); // Optional, but good practice

  // Return user object (excluding password) and tokens
  const userResponse = user.toJSON();
  delete userResponse.password;

  return {
    user: userResponse,
    accessToken,
    refreshToken,
  };
}

module.exports = {
  registerUser,
  loginUser,
};
