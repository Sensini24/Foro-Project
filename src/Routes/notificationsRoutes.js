import { Router } from "express";
import { verificarToken } from "../Controllers/utils.js";
import { getNotifications, getNotificationsType, NotificationRead } from "../Controllers/notificationsController.js";

const notifRoute = Router()

notifRoute.get("/notif/all", verificarToken, getNotifications)
notifRoute.post("/notif/isread", verificarToken, NotificationRead)
notifRoute.get("/notif/:type", verificarToken, getNotificationsType)

export default notifRoute;
