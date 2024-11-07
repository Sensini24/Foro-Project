import { Router } from "express";
import { addPost, addPostget, getAllPartialPost, getAllPost,getPost, userPosts } from "../Controllers/postController.js";
import { verificarToken, saludo, verificarTokenObligatorio } from "../Controllers/utils.js";
import { postComments } from "../Controllers/commentsControllers.js";
import mongoose from "mongoose";
const postRoute = Router();

// postRoute.use("/post", verificarToken)

const validateObjectId = (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid post ID' });
    }
    next();
};

postRoute.get("/post/addpostget", verificarToken, addPostget);
postRoute.get("/post/postlist", verificarToken, getAllPost);
postRoute.get("/post/partialAllPost", getAllPartialPost)
postRoute.post("/post/addpost", verificarToken, addPost);




postRoute.get("/post/:id", verificarToken,validateObjectId, getPost);
//* Rutas de manejo de peticiones de usuarios logeados
// postRoute.use("/user", verificarTokenObligatorio);
postRoute.get("/user/posts", verificarToken, userPosts);
export default postRoute;
