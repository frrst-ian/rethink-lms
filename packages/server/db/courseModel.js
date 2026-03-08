const prisma = require("../lib/prisma");

async function getAllCourses() {
    const courses = await prisma.course.findMany({
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
                select: {
                    name: true,
                    email: true,
                    profilePicture: true,
                },
            },
            assignments: {
                select: {
                    id: true,
                    title: true,
                    dueDate: true,
                },
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
            _count: {
                select: {
                    enrollments: true,
                },
            },
        },
    });
    return course;
}

async function createCourse(title, section, code, userId) {
    const newCourse = await prisma.course.create({
        data: {
            title,
            section,
            code,
            userId,
        },
        include: {
            createdBy: {
                select: {
                    name: true,
                    email: true,
                    profilePicture: true,
                },
            },
        },
    });
    return newCourse;
}

async function checkEnrollment(userId, courseId) {
    return await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId,
            },
        },
    });
}

async function enrollStudent(userId, courseId) {
    return await prisma.enrollment.create({
        data: {
            userId,
            courseId,
        },
    });
}

module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    enrollStudent,
    checkEnrollment,
};
