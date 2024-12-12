import { User } from "../Models/User.js";

const model = User;

export const findUser = async (req, res)=>{
    try{
        const username = req.params.username
        console.log("Username pasado: ", username)
        if(!username){
            return res.json([]);
        }
        const users = await model.find({
            user_name: { $regex: username, $options: 'i' }
        }).limit(5);
        console.log("Usuarios Encontrados: ", users)
        return res.status(200).json(users)
    }catch(err){
        res.status(500).json({err:err.message})
    }

}