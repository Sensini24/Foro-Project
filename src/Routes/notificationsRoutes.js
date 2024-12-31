import { Router } from "express";
import { verificarToken, verificarTokenObligatorio } from "../Controllers/utils.js";
import { getNotifications, getNotificationsType, NotificationRead } from "../Controllers/notificationsController.js";

const notifRoute = Router()

notifRoute.get("/notif/all", verificarTokenObligatorio, getNotifications)
notifRoute.post("/notif/isread", verificarTokenObligatorio, NotificationRead)
notifRoute.get("/notif/:type", verificarTokenObligatorio, getNotificationsType)

export default notifRoute;
