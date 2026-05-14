const db = require("../db/notificationModel");
const { validateId } = require("../helpers/validators");

async function getNotifications(req, res) {
    const notifications = await db.getNotifications(req.user.id);
    return res.json(notifications);
}

async function markAllRead(req, res) {
    await db.markAllRead(req.user.id);
    return res.json({ message: "All notifications marked as read" });
}

async function markOneRead(req, res) {
    const id = validateId(req.params.id, "Notification ID");
    await db.markOneRead(id, req.user.id);
    return res.json({ message: "Notification marked as read" });
}

module.exports = { getNotifications, markAllRead, markOneRead };