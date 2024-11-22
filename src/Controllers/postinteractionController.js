import { getInteractionsPost, getInteractionsUserPost, savePostInteractionR } from "../Repositories/PostInteractionsRepository.js";

export const savePostInteractionC = async (req, res)=>{
    const datapayload = req.usuariodatospayload
    console.log(datapayload)
    if(!datapayload){
        return res.status(401).json({unauthorized:"No estás authorizado para realizar interacciones"})
    }
    const user_id = datapayload._id;

    const {post_id, type} = req.body

    try{
        const data ={
            post_id:post_id,
            user_id:user_id,
            type:type,
            timestamp: new Date()
        }
        console.log("data interaction save: ", data)
        const result = await savePostInteractionR(data)
        console.log("Post Interaction: ", result)
        return res.status(201).json({succesmessage:`La interacción ${type} al post ha sido registrada`, result}) 
    }catch(error){
        console.error("Error en createPostInteraction:", error);
        return res.status(500).json({error:`Error al guarda la interacción ${type}`})
    }
}

export const deletePostInteractionC = async (req, res)=>{
    const [post_id, user_id, type] = req.params.body

    try{
        const data ={
            post_id,
            user_id,
            type
        }
    
        const result = await deletePostInteractionR(data)
        console.log("Post Interaction Delete: ", result)
        if (result) {
            res.status(200).json({ message: `Interacción ${type} eliminada exitosamente`, result });
        } else {
            res.status(404).json({ error: `No se encontró la interacción ${type} con los parámetros proporcionados` });
        }
    }catch(error){
        console.error("Error en deletePostInteraction:", error);
        return res.status(500).json({error:`Error al eliminar la interacción ${type}`})
    }
}

export const getInteractionPost = async(req, res)=>{
    try{
        const id = req.params.id
        console.log("Id del post interacciones :", id)
        const datapayload = req.usuariodatospayload || null;
        if(!datapayload){
            const interactionsCount = await getInteractionsPost(id)
            console.log("Cantidad de interacciones: ", interactionsCount)
            return res.status(200).json({interactionsCount, unauthorized:"No hay ningún usuario logeado"})
        }
        
        // console.log("payload en post:", datapayload);
        const user_id = datapayload._id
        const interactionsCount = await getInteractionsPost(id)
        console.log("Cantidad de interacciones: ", interactionsCount)
        const interactionsUser = await getInteractionsUserPost (id, user_id)
        console.log("Cantidad de interacciones por Usuario: ", interactionsUser)
        return res.status(200).json({interactionsCount,interactionsUser})
    }catch(error){
        res.status(500).json({error:"No se pudo obtener los datos de las interacciones"})
    }
    
}