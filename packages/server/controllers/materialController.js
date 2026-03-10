const materialModel = require("../db/materialModel");
const { uploadToCloudinary } = require("../config/cloudinary");
const cloudinary = require("cloudinary").v2;
const { validateId } = require("../helpers/validators");

async function getMaterials(req, res) {
    const courseId = validateId(req.params.courseId);
    const materials = await materialModel.getMaterials(courseId);

    return res.json(materials);
}

async function createMaterial(req, res) {
    let fileType = null;
    let fileUrl = null;
    let publicId = null;

    const courseId = validateId(req.params.courseId);
    const userId = req.user.id;

    if (req.file) {
        const result = await uploadToCloudinary(
            req.file.buffer,
            req.file.mimetype,
        );

        fileUrl = result.secure_url;
        fileType = result.fileType;
        publicId = result.public_id;
    }

    const { title, category } = req.body;

    const newMaterial = await materialModel.createMaterial(
        title,
        category,
        fileUrl,
        fileType,
        courseId,
        userId,
        publicId,
    );

    return res.json(newMaterial);
}
async function deleteMaterial(req, res) {
    const id = validateId(req.params.id);

    const existingMaterial = await materialModel.getMaterialById(id);

    if (!existingMaterial) {
        return res.status(409).json({ errors: ["Material does not exist"] });
    }

    await cloudinary.uploader.destroy(existingMaterial.publicId, {
        resource_type:
            existingMaterial.fileType === "pdf" ||
            existingMaterial.fileType === "docx"
                ? "raw"
                : "image",
    });

    await materialModel.deleteMaterial(id);
    return res.json({ message: "Material deleted successfully" });
}

module.exports = { getMaterials, createMaterial, deleteMaterial };
