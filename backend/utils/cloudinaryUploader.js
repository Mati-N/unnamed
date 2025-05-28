const cloudinary = require('../config/cloudinaryConfig'); // Import configured Cloudinary instance

/**
 * Uploads a file stream to Cloudinary.
 * @param {ReadableStream} fileStream - The readable stream of the file to upload.
 * @param {object} options - Optional Cloudinary upload options (e.g., folder, public_id, tags).
 * @returns {Promise<object>} - A promise that resolves with the Cloudinary upload response 
 *                              (e.g., { public_id, version, signature, width, height, format, resource_type, created_at, tags, pages, bytes, type, etag, placeholder, url, secure_url, original_filename, ... })
 *                              or rejects with an error.
 */
function uploadToCloudinary(fileStream, options = {}) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(new Error('Failed to upload file to Cloudinary. ' + error.message));
        }
        resolve(result);
      }
    );

    // Pipe the file stream to Cloudinary's upload stream
    fileStream.pipe(uploadStream);
  });
}

module.exports = {
  uploadToCloudinary,
};
