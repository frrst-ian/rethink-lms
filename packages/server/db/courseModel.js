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

async function createCourse(title, description, userId) {
    const newCourse = await prisma.course.create({
        data: {
            title: title,
            description: description,
            userId: userId,
        },
        include: {
            createdBy: {
                select: {
                    name: true,
                    password: false,
                },
            },
        },
    });
    return newCourse;
}

async function enrollStudent(userId, courseId) {
    await prisma.enrollment.create({
        data: {
            userId,
            courseId,
        },
    });
}

module.exports = { getAllCourses, getCourseById, createCourse, enrollStudent };
