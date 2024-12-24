import { Notification } from "../Models/NotificationModel.js"

const modelNotification = Notification;

export const getNotifications = async (req,res)=>{
    // const type = req.body.params

    try{
        const datapayload = req.usuariodatospayload || null
        const idUsuario = datapayload._id
        // console.log("ID USUARIO DESDE CONTROLLER NIOTIF: ", idUsuario)
        const notifications = await modelNotification.find({recipientId:idUsuario}).sort({createdAt:-1})
        if(!notifications){
            return res.status(404).json({message:`No se encontro ninguna notification sobre ${type} `})
        }

        // console.log("NOTIFICACIOES DESDE CONTROLADOR: ", notifications)
        res.render("notifications",{
            notifications: notifications
        })
    }catch(err){
        return res.status(400).json({message: `No se pudo obtener las notificaciones`})
    }
}