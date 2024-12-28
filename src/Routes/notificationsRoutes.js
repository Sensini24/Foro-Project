import { Router } from "express";
import { verificarToken } from "../Controllers/utils.js";
import { getNotifications, NotificationRead } from "../Controllers/notificationsController.js";

const notifRoute = Router()

notifRoute.get("/notif/all", verificarToken, getNotifications)
notifRoute.post("/notif/isread", verificarToken, NotificationRead)

export default notifRoute;
