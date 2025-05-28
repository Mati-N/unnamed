const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: '../../.env' }); // Ensure .env variables are loaded relative to project root

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.warn(
    'Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are not fully set. ' +
    'File uploads will likely fail. Please check your .env file or environment configuration.'
  );
  // Optionally, you could throw an error here to prevent the app from starting without proper config
  // throw new Error('Cloudinary configuration is incomplete.');
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true, // Recommended to use https
});

module.exports = cloudinary;
