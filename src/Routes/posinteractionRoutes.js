import { Router } from "express";
import { verificarToken } from "../Controllers/utils.js";
import { deletePostInteractionC, getInteractionPost, savePostInteractionC } from "../Controllers/postinteractionController.js";

const routePostInteractions = Router()
routePostInteractions.post("/interactions/likes", verificarToken, savePostInteractionC)
routePostInteractions.get("/interactions/:id", verificarToken, getInteractionPost)
routePostInteractions.delete("/interactions/delete", verificarToken, deletePostInteractionC)

export default routePostInteractions;