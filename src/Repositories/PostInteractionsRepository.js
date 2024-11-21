import { PostInteractions } from "../Models/PostInteractions.js";

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




export const getInteractionPost =async (user_id)=>{
    try{
        const interaction = modelPostInteractions.find({"user_id":user_id})
        .populate("user_id", "user_name email")
        .populate("post_id", "title author")
    
        return await interaction;
    }catch(error){
        console.error("Error al buscar la interaccion del post:", error);
        throw error;
    }
}

