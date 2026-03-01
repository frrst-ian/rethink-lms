const multer = require("multer");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (fileBuffer, mimetype) => {
  return new Promise((resolve, reject) => {
    const extension = mimetype.split("/")[1];
    const publicId = `pfp-${Date.now()}`;

    cloudinary.uploader
      .upload_stream(
        {
          folder: "odin-book/",
          public_id: publicId,
          allowed_formats: ["jpg", "jpeg", "png"],
          format: extension,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      )
      .end(fileBuffer);
  });
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    allowedTypes.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Only JPG, JPEG, and PNG files are allowed"), false);
  },
});

module.exports = { upload, uploadToCloudinary };
