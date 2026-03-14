const prisma = require("../lib/prisma");

async function getAllCourses(userId, role) {
    const courses = await prisma.course.findMany({
        where:
            role === "teacher"
                ? { userId }
                : { enrollments: { some: { userId } } },
        include: {
            createdBy: {
                select: {
                    name: true,
                    email: true,
                    profilePicture: true,
                },
            },
            _count: {
                select: {
                    enrollments: true,
                },
            },
        },
    });
    return courses;
}

async function getCourseById(id) {
    const course = await prisma.course.findUnique({
        where: { id },
        include: {
            createdBy: {
                select: { name: true, email: true, profilePicture: true },
            },
            assignments: {
                select: { id: true, title: true, dueDate: true },
                orderBy: { dueDate: "asc" },
            },
            enrollments: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            profilePicture: true,
                        },
                    },
                },
            },
            _count: { select: { enrollments: true } },
        },
    });
    return course;
}

async function createCourse(title, section, code, userId) {
    const newCourse = await prisma.course.create({
        data: { title, section, code, userId },
        include: {
            createdBy: {
                select: { name: true, email: true, profilePicture: true },
            },
            _count: { select: { enrollments: true } },
        },
    });
    return newCourse;
}

async function checkEnrollment(userId, courseId) {
    return await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId } },
    });
}

async function enrollStudent(userId, courseId) {
    return await prisma.enrollment.create({
        data: { userId, courseId },
    });
}

async function getAssignmentById(courseId, id) {
    return await prisma.assignment.findUnique({
        where: { courseId, id },
    });
}

async function createAssignment(
    title,
    description,
    dueDate,
    courseId,
    userId,
    fileUrl,
    fileType,
    originalName,
) {
    return await prisma.assignment.create({
        data: {
            title,
            description,
            dueDate,
            courseId,
            userId,
            fileUrl,
            fileType,
            originalName,
        },
    });
}

async function deleteCourse(id) {
    return await prisma.course.delete({ where: { id } });
}

async function getCourseByCode(code) {
    return await prisma.course.findUnique({ where: { code } });
}

module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    enrollStudent,
    checkEnrollment,
    getAssignmentById,
    createAssignment,
    deleteCourse,
    getCourseByCode,
};
