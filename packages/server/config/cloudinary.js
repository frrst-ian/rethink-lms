const multer = require("multer");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getFileType = (mimetype) => {
  const map = {
    "application/pdf": "pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "docx",
    "image/jpeg": "jpg",
    "image/png": "png",
  };
  return map[mimetype] || null;
};

const buildPublicId = (originalname) => {
  const nameWithoutExt = originalname.replace(/\.[^.]+$/, "");
  return nameWithoutExt
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
};

const uploadToCloudinary = (fileBuffer, mimetype, originalname = "") => {
  return new Promise((resolve, reject) => {
    const fileType = getFileType(mimetype);
    const publicId = buildPublicId(originalname);

    const resourceType =
      mimetype === "image/jpeg" ||
      mimetype === "image/png" ||
      mimetype === "image/jpg"
        ? "image"
        : "raw";

    cloudinary.uploader
      .upload_stream(
        {
          folder: "rethink/",
          public_id: publicId,
          resource_type: resourceType,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve({ ...result, fileType });
        },
      )
      .end(fileBuffer);
  });
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    allowedTypes.includes(file.mimetype)
      ? cb(null, true)
      : cb(
          new Error("Only JPG, JPEG, PNG, PDF & docx files are allowed"),
          false,
        );
  },
});

module.exports = { upload, uploadToCloudinary };
