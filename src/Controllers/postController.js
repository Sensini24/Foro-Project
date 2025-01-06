import mongoose from "mongoose";
import { Post } from "../Models/Post.js";
import { limitarTexto } from "./utils.js";
import { getInteractionsPost, getInteractionsUserPost } from "../Repositories/PostInteractionsRepository.js";

const model = Post;

export const getPost = async(req, res)=>{
    
    const datapayload = req.usuariodatospayload || null;
    // console.log("payload en post:", datapayload);
    const id = req.params.id

    if(!id){
        return res.status(400).json({message:"El id no existe o es incorrecto"})
    }

    const post = await model.findById(id)
    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }
    // // const idObjectId = new mongoose.Types.ObjectId(id)
    // if(!datapayload){
    //     const interactionsCount = await getInteractionsPost(id)
    //     console.log("Cantidad de interacciones: ", interactionsCount)
        
    //     // console.log("Post por Id: ", post)
    //     return res.render("contentblog", {post,interactionsCount, layout:true})
    // }else{
    //     const user_id = datapayload._id
    //     const interactionsUser = await getInteractionsUserPost(id, user_id)
    //     console.log("Cantidad de interacciones por Usuario: ", interactionsUser)
    //     const interactionsCount = await getInteractionsPost(id)
    //     console.log("Cantidad de interacciones: ", interactionsCount)
        
    //     // console.log("Post por Id: ", post)
    //     return res.render("contentblog", {post,interactionsCount,interactionsUser, layout:true})
    // }
    
        
    // console.log("Post por Id: ", post)
    return res.render("contentblog", {post, layout:true})
    
}

export const getAllPost = async (req, res)=>{
    
    try{

         //* obtener los datos de payload que se envia desde el middleware de verificar token
        const datapayload = req.usuariodatospayload || null;
        // console.log("payload en list post:", datapayload);

        //* Obtener posts completos
        let posts = await model.find({});

        posts.forEach(element => {
            // const postisodate = element.date
            element.content = limitarTexto(element.content) + ".... (Haz click en 'Leer más' para seguir leyendo)"
            // console.log(postisodate)
            // console.log(postisodate.toLocaleDateString() + " " + postisodate.toLocaleTimeString())
            
        });

        return res.render("postList", {posts, layout:false})
       
        // res.status(200).json(blogs); // Responder con los blogs obtenidos
    }catch(error){
        console.error('Error al obtener los posts:', error);
        return res.status(500).json({ message: 'Error al obtener los posts' });
    }
}

export const getAllPartialPost = async (req, res)=>{
    
    try{

         //* obtener los datos de payload que se envia desde el middleware de verificar token
        const datapayload = req.usuariodatospayload || null;
        // console.log("payload en list post:", datapayload);

        //* Obtener posts completos
        let posts = await model.find({});

        posts.forEach(element => {
            // const postisodate = element.date
            element.content = limitarTexto(element.content) + ".... (Haz click en 'Leer más' para seguir leyendo)"
            // console.log(postisodate)
            // console.log(postisodate.toLocaleDateString() + " " + postisodate.toLocaleTimeString())
            
        });

        console.log("Posts totales: ", posts)
        return res.render("partials/partial-posts", { posts, layout: true });
       
        // res.status(200).json(blogs); // Responder con los blogs obtenidos
    }catch(error){
        console.error('Error al obtener los posts:', error);
        res.status(500).json({ message: 'Error al obtener los posts' });
    }
}

export const userPosts = async(req, res)=>{
    const datapayload = req.usuariodatospayload;
    if(!datapayload){
        return res.status(501).json({ message: "Ooops, tú no deberías estar aquí" });
    }
    console.log("Payload para user posts: ", datapayload)

    const username = datapayload.user_name
    console.log("Username actual: ", username)

    
    let userposts = await model.find({author: username})

    let textocompleto = userposts.content
    userposts.forEach(texto =>{

        texto.content = limitarTexto(texto.content) + ".... (Haz click en 'Leer más' para seguir leyendo)"
        console.log("Post por autor: ", texto.title)
    })
    
    // console.log("Post por autor: ", userposts)
    const isAuthenticated = req.usuariodatospayload != null ? true : false; 
    
    // console.log("esta autneticado: ", isAuthenticated)
    res.render("partials/partial-userPosts", {userposts, username, layout:true})
    // res.render("userposts", {userposts, username})
}


export const addPostget = async(req, res)=>{
    const datapayload = req.usuariodatospayload
    if(!datapayload){
        return res.status(501).json({ message: "Ooops, tú no deberías estar aquí" });
    }
    res.render("post",{layout:true , viewClass: 'view-addpost'})
}

export const addPost = async(req, res)=>{
    const datapayload = req.usuariodatospayload
    

    const username = datapayload.user_name
    console.log(datapayload)
    const {title, content, tags} = req.body
    
    if (title == "" || title == null) {
        console.log("Error de contenido");
        return res.status(400).json({ message: "Título es requeridos" });
    }
    
    if(content == "" || content == null) {
        console.log("Error de contenido");
        return res.status(400).json({ message: "Contenido es requerido" });
    }

    const arrayTags = tags.split(",").map(tag=>tag.trim()).filter(tag=>tag.length >0)
    
    const nuevoPost = await model({
        title:title,
        content:content,
        author: username,
        date: new Date(),
        tags:arrayTags
    })

    try {
        await nuevoPost.save();
        console.log("Exito gaurdando post")
        res.status(201).json({ message: "Post creado exitosamente", post: nuevoPost });
    } catch (error) {
        console.error("Error al guardar el post:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}
