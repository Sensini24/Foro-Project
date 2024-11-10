import mongoose from "mongoose";
import { Comment } from "../Models/Comment.js";
import { Post } from "../Models/Post.js";

const modelComment = Comment
const modelPost = Post

export const getComments = async(req, res)=>{
    try{
        const id = req.params.id;
        // const idObjectId = new mongoose.Types.ObjectId(id)

        const datapayload = req.usuariodatospayload || null
        console.log(datapayload)

        /*
        comparar el user name de usuario actual con el author del post. Si coincide entonces los comentarios son del author del user actual y se crea el boton de ocultar o mostrar
        */
        const [commentsAll, post] = await Promise.all([
            modelComment.find({ post_id: id }),
            modelPost.findById(id)
        ])
        if(!post){
            return res.status(404).json({message:"Post no encontrado"})
        }

        //* Autor de post abierto
        const author = post.author;
        //* Nombre de usuario en sesion
        const username = datapayload ? datapayload.user_name : ""

        //* Si el author del post es el mismo que el que esta en sesion
        const propietario = username === author
        const visibleComments = propietario ? commentsAll : commentsAll.filter(comment => comment.visible)

        console.log("Propietario: ", propietario)
        res.render("partials/partial-comments", 
            {
                //se pasa el filtrado de comments
                commentsAll:visibleComments,
                propietario,
                username,
                author,
                layout:false 
            })
    }catch(err){
        console.log("No se pudo obtener los comment", err)
        res.status(500).json({message:"No se pudo obtener los comentarios"})
    }
}

export const postComments = async(req, res)=>{
    const datapayload = req.usuariodatospayload


    //* Status code de falta de autenticacion, se envía al servidor y allá se exige un registro previo para permitir la realización de un comentario.
    if(!datapayload) {
        console.log("No está autorizado a comentar");
        return res.status(401).json({ error: "Debes estar registrado para comentar" });
    }
    const username = datapayload.user_name || null
    const {comment, post_id} = req.body

    console.log("Usuario: ", username, comment)
    // console.log(req.body)
    // // const bodyString =new String(post_id)
    // console.log(typeof post_id)

    const postid = new mongoose.Types.ObjectId(post_id)

    const addcomment = await modelComment({
        post_id: postid,
        user_name: username,
        comment: comment,
        date: new Date(),
        visible:true
    })

    addcomment.save()
    .then(doc => console.log("Comentario guardado exitosamente", doc))
    .catch(error=> console.log("Error al guardar el comentario", error))

    res.redirect("/post/postlist")
}

export const deleteComments = async(req, res)=>{
    const idComentario = req.params.id
    const idPost = req.body.idPost

    //! Convertimos a Object ID para que se acepte como parámetro en la eliminacion en database.
    const objectId = new mongoose.Types.ObjectId(idComentario)

    if(idComentario == null){
        return res.redirect(`/post/:${idPost}`)
    }

    const comment = modelComment.deleteOne({_id:objectId})
    .then(doc => console.log("Comentario eliminado exitosamente", doc))
    .catch(error=> console.log("Error al eliminar el comentario", error))

    console.log("Id comment: ", idComentario , "Id Post: ", idPost)
    console.log("Id comment: ", typeof idComentario, "Id Post: ", typeof idPost)
    console.log("ELIMINADO")

    return res.status(200).json({ success: "Comentario Eliminado" });

}

export const changeVisible = async (req, res) =>{
    const commentId = req.params.id.trim();
    
    console.log("Id de comentario: ", commentId)
    const { visible } = req.body;
    console.log("Boolean variable: ", visible)
    try {
        const comment = await modelComment.findByIdAndUpdate(commentId, { visible: visible }, { new: true });
        if (comment) {
            return res.status(200).json({ message: 'Comentario actualizado correctamente', comment });
        } else {
            return res.status(404).json({ message: 'Comentario no encontrado' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
}

export const requestComment = async (req, res)=>{
    try{
        const userpayload = req.usuariodatospayload

        if(!userpayload){
            res.status(401).json({error:"No estás autorizado a comentar"})
        }
        const idCommentParent = req.params.id
        const user_name = userpayload.user_name
        const {comment} = req.body

        const newComment = new modelComment(
            {
                "idpostparent":idCommentParent,
                "user_name": user_name,
                "comment": comment,
                "date": new Date(),
                "visible": true
            }   
        )

        newComment.save
        .then(doc => console.log("Comentario guardado exitosamente", doc))
        .catch(error=> console.log("Error al guardar el comentario", error))
    }catch(err){
        res.status(500).json({error:"No se pudo guardar el comentario"})
    }
    
}