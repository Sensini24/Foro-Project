import { populate } from "dotenv";
import { PostInteractions } from "../Models/PostInteractions.js";
import mongoose from "mongoose";

const modelPostInteractions = PostInteractions;

export const savePostInteractionR = async (data) => {
    try {
        const interaction = new modelPostInteractions(data);
        return await interaction.save();
    } catch (error) {
        console.error("Error al guardar la interacción:", error);
        throw error;
    }
}



export const deletePostInteractionR = async(data)=>{
    try{
        const interaction = await modelPostInteractions.findOneAndDelete(data)
        return interaction
    }catch(error){
        console.error("Error al eliminar la interacción:", error);
        throw error;
    }
}


export const getInteractionsPost = async (post_id) => {
    try {
        const interaction = await modelPostInteractions.aggregate([
            { $match: { post_id: new mongoose.Types.ObjectId(post_id) } },//* Aqui se filtra el post del que se extraerá todos sus interacciones
            {
                $group: {
                    _id: "$post_id",
                    sumLikes: {
                        $sum: { $cond: [{ $eq: ["$type", "like"] }, 1, 0] }
                    },
                    sumDislikes: {
                        $sum: { $cond: [{ $eq: ["$type", "dislike"] }, 1, 0] }
                    },
                    sumShares: {
                        $sum: { $cond: [{ $eq: ["$type", "outstanding"] }, 1, 0] }
                    }
                }
            }
        ]);

        //EN CASO DE QUE NO HAY NINGUNA INTERACCION PREVIA
        if (interaction.length === 0) {
            return [
                {
                    post_id,
                    sumLikes: 0,
                    sumDislikes: 0,
                    sumShares: 0,
                },
            ];
        }
        return interaction; // Retornar el resultado de la agregación
    } catch (error) {
        console.error("Error al buscar la interacción del post:", error);
        throw error;
    }
};

export const getInteractionsUserPost = async (post_id, user_id) => {
    try {
        const interaction = await modelPostInteractions.aggregate([
            { 
                $match: { 
                    post_id: new mongoose.Types.ObjectId(post_id), 
                    user_id: new mongoose.Types.ObjectId(user_id) 
                } 
            },
            {
                $group: {
                    _id: { post_id: "$post_id", user_id: "$user_id" }, // Agrupar por post_id y user_id. Estos son segun los parametros que tengas y hacen alusion a los campos dentro de la collection actual
                    sumLikes: {
                        $sum: { $cond: [{ $eq: ["$type", "like"] }, 1, 0] }
                    },
                    sumDislikes: {
                        $sum: { $cond: [{ $eq: ["$type", "dislike"] }, 1, 0] }
                    },
                    sumShares: {
                        $sum: { $cond: [{ $eq: ["$type", "outstanding"] }, 1, 0] }
                    }
                }
            },
            {
                $lookup: {
                    from: "users", // Nombre de la colección de usuarios en la base de datos.
                    localField: "_id.user_id", // Campo de la colección actual el cual viene de group
                    foreignField: "_id", // id de usuarios en su collection
                    as: "user_info" // Nombre del campo donde se guardarán los datos relacionados
                }
            },
            {
                $project: {
                    _id: 0,
                    post_id: "$_id.post_id",
                    user_id: "$_id.user_id",
                    user_info: { $arrayElemAt: ["$user_info", 0] }, // Si esperas un solo usuario, toma el primero
                    sumLikes: 1,
                    sumDislikes: 1,
                    sumShares: 1
                }
            }
        ]);

        //EN CASO DE QUE EL USUARIO NO HAY INTERACTUADO CON EL POST
        if (interaction.length === 0) {
            return [
                {
                    post_id,
                    user_id,
                    user_info: null,
                    sumLikes: 0,
                    sumDislikes: 0,
                    sumShares: 0,
                },
            ];
        }

        return interaction; // Retornar el resultado de la agregación
    } catch (error) {
        console.error("Error al buscar la interacción del post:", error);
        throw error;
    }
};



