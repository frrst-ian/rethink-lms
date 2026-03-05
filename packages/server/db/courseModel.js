const prisma = require("../lib/prisma");

async function getAllCourses() {
    const courses = await prisma.course.findMany({
        include: {
            createdBy: {
                select: {
                    name: true,
                    password: false,
                },
            },
        },
    });
    return courses;
}

async function getCourseById(id) {
    const course = await prisma.course.findUnique({
        where: { id },
    });
    return course;
}

module.exports = { getAllCourses, getCourseById };
