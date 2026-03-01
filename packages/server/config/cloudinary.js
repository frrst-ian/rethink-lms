const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    const extension = file.mimetype.split('/')[1];
    const publicId = `pfp-${Date.now()}`;
    
    const params = {
      folder: 'odin-book/',
      public_id: publicId,
      secure: true, 
      allowed_formats: ['jpg', 'jpeg', 'png'],
      format: extension,
    };

    return params;
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, and PNG files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024 // 10MB
  },
  fileFilter: fileFilter
});

upload.errorHandler = (err, req, res, next) => {
  console.error('Upload error:', err);
  res.status(400).json({
    success: false,
    error: err.message
  });
};

module.exports = upload;