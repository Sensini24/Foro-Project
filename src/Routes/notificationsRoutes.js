import { Router } from "express";
import { verificarToken } from "../Controllers/utils.js";
import { getNotifications } from "../Controllers/notificationsController.js";

const notifRoute = Router()

notifRoute.get("/notif/all", verificarToken, getNotifications)

export default notifRoute;
