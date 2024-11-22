import { Router } from "express";
import { verificarToken } from "../Controllers/utils.js";
import { getInteractionPost, savePostInteractionC } from "../Controllers/postinteractionController.js";

const routePostInteractions = Router()

routePostInteractions.post("/interactions/likes", verificarToken, savePostInteractionC)
routePostInteractions.get("/interactions/:id", verificarToken, getInteractionPost)

export default routePostInteractions;