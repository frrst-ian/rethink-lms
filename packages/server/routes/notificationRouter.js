const { Router } = require("express");
const notificationRouter = Router();
const notificationController = require("../controllers/notificationController");
const authenticateJwt = require("../middleware/auth");

notificationRouter.get("/", authenticateJwt, notificationController.getNotifications);
notificationRouter.patch("/read-all", authenticateJwt, notificationController.markAllRead);
notificationRouter.patch("/:id/read", authenticateJwt, notificationController.markOneRead);

module.exports = notificationRouter;