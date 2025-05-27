const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: '../.env' }); // Ensure .env from backend directory is loaded

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Optional: forces HTTPS URLs
});

module.exports = cloudinary;
