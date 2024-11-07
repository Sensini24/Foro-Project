import { Router } from "express";
import { getlogin, getsignup, logoutUser, upload, uploadImageProfile, UserCharge, userlogin, userRegister } from "../Controllers/authControllers.js";
import { verificarToken } from "../Controllers/utils.js";

const authRoute = Router()

authRoute.post("/auth/login", userlogin)

authRoute.get("/auth/login", getlogin)

authRoute.get("/auth/logout", logoutUser)
authRoute.get("/auth/sign-up", getsignup)

authRoute.post("/auth/sign-up", userRegister)

authRoute.get("/user/getUser", verificarToken, UserCharge)
authRoute.post("/user/uploadImage", verificarToken, upload.single('profilePic'), uploadImageProfile)


export default authRoute