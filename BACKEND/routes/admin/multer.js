
const multer=require('multer')
const path = require('path');

// Define storage options for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/'); // Set file storage location
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Set unique filename
  },
});

// File filter to validate allowed MIME types (JPG, PNG, or PDF)
const fileFilter = (req, file, cb) => {
  const validMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (validMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, or PDF allowed'), false); // Reject file
  }
};

// Multer middleware setup
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Set file size limit (10 MB)
});

module.exports = upload;