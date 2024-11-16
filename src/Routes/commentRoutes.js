import { Router } from "express";
import { changeVisible, deleteComments, getComments, getCommentsRequest, postComments, requestComment } from "../Controllers/commentsControllers.js";
import { verificarToken, verificarTokenObligatorio } from "../Controllers/utils.js";

const commentRouter = Router()

commentRouter.use("/comments", verificarToken)

commentRouter.get("/comments/:id",verificarToken, getComments)
commentRouter.get("/comments/request/:id/:idcommentparent",verificarToken, getCommentsRequest)
commentRouter.put("/comment/put/:id", changeVisible)

// commentRouter.post("/user/comment", verificarTokenObligatorio, postComments)
commentRouter.post("/user/comment", verificarToken, postComments)
commentRouter.post("/comment/request", verificarToken, requestComment)
commentRouter.delete("/user/deleteComments/:id", verificarTokenObligatorio, deleteComments)


export default commentRouter;