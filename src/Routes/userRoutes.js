import { Router } from "express";
import { verificarToken } from "../Controllers/utils.js";
import { findUser } from "../Controllers/userController.js";

const userRoutes = Router();

userRoutes.get("/user/findUsers/:username", verificarToken, findUser);

export default userRoutes;