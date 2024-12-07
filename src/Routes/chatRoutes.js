import { Router } from "express";
import { getChat } from "../Controllers/chatContoller.js";
import { verificarToken } from "../Controllers/utils.js";

const chatRoute = Router()

chatRoute.get("/user/chat",verificarToken, getChat)

export default chatRoute;