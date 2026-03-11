const prisma = require("../lib/prisma");

async function getMaterials(courseId) {
    return await prisma.material.findMany({
        where: { courseId: courseId },
        include: {
            author: {
                select: { name: true },
            },
        },
        orderBy: { createdAt: "asc" },
    });
}

async function createMaterial(
    title,
    category,
    fileUrl,
    fileType,
    courseId,
    userId,
    publicId,
    originalName,
) {
    return await prisma.material.create({
        data: {
            title,
            category,
            fileUrl,
            fileType,
            courseId,
            userId,
            publicId,
            originalName,
        },
    });
}

async function getMaterialById(id) {
    return await prisma.material.findUnique({
        where: { id: id },
    });
}

async function deleteMaterial(id) {
    return await prisma.material.delete({
        where: { id: id },
    });
}

module.exports = {
    getMaterials,
    createMaterial,
    getMaterialById,
    deleteMaterial,
};
