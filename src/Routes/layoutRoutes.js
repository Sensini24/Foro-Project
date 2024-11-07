import { Router } from "express";
import { getLayout } from "../Controllers/layoutController.js";
import { verificarToken } from "../Controllers/utils.js";

export const layoutRoute = Router()

layoutRoute.get("/layout", verificarToken, getLayout)