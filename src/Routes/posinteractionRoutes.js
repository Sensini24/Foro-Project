import { Router } from "express";
import { verificarToken } from "../Controllers/utils.js";
import { savePostInteractionC } from "../Controllers/postinteractionController.js";


const routePostInteractions = Router()

routePostInteractions.post("/interactions/likes", verificarToken, savePostInteractionC)

export default routePostInteractions;