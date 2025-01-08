import { Router } from "express";
// import { verificarToken } from "../Controllers/utils.js";
import { getModalChatStart, getSearchUser } from "../Controllers/modalsControllers.js";

const modalsRoute = Router();

modalsRoute.get('/partial-menuChat', getModalChatStart)
modalsRoute.get('/partial-SearchUserChat', getSearchUser)
export default modalsRoute;