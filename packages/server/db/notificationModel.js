const prisma = require("../lib/prisma");

async function createNotification(userId, message, link = null) {
    return prisma.notification.create({
        data: { userId, message, link },
    });
}

async function createManyNotifications(userIds, message, link = null) {
    return prisma.notification.createMany({
        data: userIds.map((userId) => ({ userId, message, link })),
    });
}

async function getNotifications(userId) {
    return prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 30,
    });
}

async function markAllRead(userId) {
    return prisma.notification.updateMany({
        where: { userId, read: false },
        data: { read: true },
    });
}

async function markOneRead(id, userId) {
    return prisma.notification.update({
        where: { id, userId },
        data: { read: true },
    });
}

module.exports = {
    createNotification,
    createManyNotifications,
    getNotifications,
    markAllRead,
    markOneRead,
};