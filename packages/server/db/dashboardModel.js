const prisma = require("../lib/prisma");

async function getTeacherDashboard(userId) {
    const courses = await prisma.course.findMany({
        where: { userId },
        select: { id: true },
    });

    const courseIds = courses.map((c) => c.id);

    const [enrollmentCount, totalSubmissions, flaggedCount, recentSubmissions, allResults] =
        await Promise.all([
            prisma.enrollment.count({ where: { courseId: { in: courseIds } } }),
            prisma.submission.count({
                where: { assignment: { courseId: { in: courseIds } } },
            }),
            prisma.result.count({
                where: {
                    isFlagged: true,
                    submission: { assignment: { courseId: { in: courseIds } } },
                },
            }),
            prisma.submission.findMany({
                where: { assignment: { courseId: { in: courseIds } } },
                orderBy: { submittedAt: "desc" },
                take: 5,
                include: {
                    user: { select: { name: true, profilePicture: true } },
                    assignment: { select: { title: true } },
                    result: { select: { ai_percentage: true, isFlagged: true } },
                },
            }),
            prisma.result.findMany({
                where: {
                    ai_percentage: { not: null },
                    submission: { assignment: { courseId: { in: courseIds } } },
                },
                select: {
                    ai_percentage: true,
                    submission: { select: { submittedAt: true } },
                },
                orderBy: { submission: { submittedAt: "asc" } },
            }),
        ]);

    const aiAvgResult = await prisma.result.aggregate({
        where: {
            ai_percentage: { not: null },
            submission: { assignment: { courseId: { in: courseIds } } },
        },
        _avg: { ai_percentage: true },
    });

    const weeklyMap = {};
    for (const r of allResults) {
        const date = new Date(r.submission.submittedAt);
        const monday = new Date(date);
        monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
        monday.setHours(0, 0, 0, 0);
        const key = monday.toISOString().split("T")[0];
        if (!weeklyMap[key]) weeklyMap[key] = { scores: [], count: 0 };
        weeklyMap[key].scores.push(r.ai_percentage);
        weeklyMap[key].count += 1;
    }

    const weeklyTrend = Object.entries(weeklyMap)
        .sort(([a], [b]) => new Date(a) - new Date(b))
        .map(([week, { scores, count }]) => ({
            week,
            avgAi: parseFloat((scores.reduce((s, v) => s + v, 0) / scores.length).toFixed(2)),
            count,
        }));

    return {
        totalCourses: courses.length,
        totalStudents: enrollmentCount,
        totalSubmissions,
        flaggedCount,
        avgAiPercentage: aiAvgResult._avg.ai_percentage
            ? parseFloat(aiAvgResult._avg.ai_percentage.toFixed(2))
            : null,
        recentSubmissions,
        weeklyTrend,
    };
}

async function getStudentDashboard(userId) {
    const now = new Date();
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const enrollments = await prisma.enrollment.findMany({
        where: { userId },
        select: { courseId: true },
    });

    const courseIds = enrollments.map((e) => e.courseId);

    const [upcomingAssignments, submissionCount, aiAvgResult] = await Promise.all([
        prisma.assignment.findMany({
            where: {
                courseId: { in: courseIds },
                dueDate: { gte: now, lte: in7Days },
            },
            orderBy: { dueDate: "asc" },
            select: {
                id: true,
                title: true,
                dueDate: true,
                course: { select: { title: true, id: true } },
            },
        }),
        prisma.submission.count({ where: { userId } }),
        prisma.result.aggregate({
            where: {
                ai_percentage: { not: null },
                submission: { userId },
            },
            _avg: { ai_percentage: true },
        }),
    ]);

    return {
        enrolledCourses: courseIds.length,
        upcomingAssignments,
        submissionCount,
        avgAiPercentage: aiAvgResult._avg.ai_percentage
            ? parseFloat(aiAvgResult._avg.ai_percentage.toFixed(2))
            : null,
    };
}

module.exports = { getTeacherDashboard, getStudentDashboard };